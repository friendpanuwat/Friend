#!/usr/bin/env python3
"""Plan D for one clip, start to finish: ask the AI for a plan, check it, one fix round, then the fallback.

usage: plan_d.py <input.json> <editorial|overlay> <out_dir> [--faces faces.json] [--no-render]
                 [--dry] [--answer answer.json] [--fix-answer answer.json]
  --dry          write out_dir/request.json (what would be sent) and stop: no API key needed
  --answer       use this answer instead of calling the API (tests, replays); --fix-answer is the answer to the fix round
writes out_dir/plan.json (ready for plan2timeline.py), out_dir/report.json (issues left, what the fallback changed)
and out_dir/run.json (every API call with its token usage, in the cost_model.py "calls" format).

Steps (DECISIONS 2 and 5):
  1. request from prompt.py — Sonnet 5.5, effort low, cached system block, answer forced into JSON by a schema
  2. assemble.py → plan → validate.py (with the render check)
  3. any error → ONE fix round in the same conversation (the answer is passed back unchanged, then the issues)
  4. still blocking → fallback.py (B14 text cards, drops); quality errors that remain are reported, the clip is made
  5. no answer at all (API down, refusal) → a plan with subtitles and no scenes, so the customer still gets a clip
The API key comes from the environment (ANTHROPIC_API_KEY, set in the environment settings — never in chat or code).
"""
import json, os, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import prompt, assemble, validate, fallback


def call_record(resp, model):
    u = resp.usage
    return {'stage': 'scene', 'model': model, 'served': resp.model, 'in': u.input_tokens, 'out': u.output_tokens,
            'cache_read': u.cache_read_input_tokens or 0, 'cache_write_5m': u.cache_creation_input_tokens or 0,
            'stop': resp.stop_reason}


def ask(client, req):
    """One API call → (answer dict or None, the response, why it failed)."""
    import anthropic
    try:
        resp = client.beta.messages.create(**req)
    except anthropic.BadRequestError as e: return None, None, f'bad request: {e.message}'
    except anthropic.AuthenticationError: return None, None, 'no valid API key in the environment'
    except anthropic.RateLimitError: return None, None, 'rate limited (after the SDK\'s retries)'
    except anthropic.APIStatusError as e: return None, None, f'API error {e.status_code}: {e.message}'
    except anthropic.APIConnectionError: return None, None, 'network error'
    if resp.stop_reason == 'refusal': return None, resp, f'refused ({getattr(resp.stop_details, "category", None)})'
    if resp.stop_reason == 'max_tokens': return None, resp, 'answer cut off at max_tokens'
    text = next((b.text for b in resp.content if b.type == 'text'), '').strip()
    if text.startswith('```'): text = text.split('\n', 1)[1].rsplit('```', 1)[0]   # only without the schema
    try: return json.loads(text), resp, None
    except json.JSONDecodeError: return None, resp, 'answer is not JSON'


def without_schema(req):
    """The same request without output_config.format, asking for bare JSON instead (used once if the API refuses the
    schema: it has not been tried against the API yet — no key in this environment when it was written)."""
    r = dict(req, output_config={'effort': req['output_config']['effort']})
    ask_json = '\n\nAnswer with only the JSON object {"camera": [...], "scenes": [...]} in the format of the example, nothing else.'
    r['messages'] = [dict(req['messages'][0], content=req['messages'][0]['content'] + ask_json)]
    return r


def run(inp, style, out, faces=None, render=True, dry=False, answer=None, fix_answer=None):
    os.makedirs(out, exist_ok=True)
    cat = prompt.load_catalog()
    req = prompt.request(inp, style, cat)
    if dry:
        json.dump(req, open(os.path.join(out, 'request.json'), 'w'), ensure_ascii=False, indent=1)
        return None
    history = inp.get('history')
    calls, log, client, resp = [], [], None, None
    if answer is None:
        import anthropic
        client = anthropic.Anthropic()
        answer, resp, why = ask(client, req)
        if resp is not None: calls.append(call_record(resp, req['model']))
        if why: log.append(f'plan request failed: {why}')
        if why and why.startswith('bad request'):   # most likely the answer schema: ask once more without it
            req = without_schema(req)
            answer, resp, why = ask(client, req)
            if resp is not None: calls.append(call_record(resp, req['model']))
            log.append('asked again without the schema' + (f': {why}' if why else ''))
    plan = assemble.assemble(inp, answer or {'camera': [], 'scenes': []}, style)
    R, _ = validate.validate(plan, cat, faces, history, render=render)
    errors = [i for i in R.issues if i['level'] == 'error']
    if answer is not None and errors:   # 3. one fix round
        log.append(f'fix round: {len(errors)} errors sent back')
        fixed = fix_answer
        if fixed is None and client is not None and resp is not None:
            req2 = dict(req, messages=req['messages'] + [{'role': 'assistant', 'content': resp.content},
                                                          {'role': 'user', 'content': prompt.fix_message(errors)}])
            fixed, resp2, why = ask(client, req2)
            if resp2 is not None: calls.append(call_record(resp2, req['model']))
            if why: log.append(f'fix request failed: {why}')
        if fixed is not None:
            plan2 = assemble.assemble(inp, fixed, style)
            R2, _ = validate.validate(plan2, cat, faces, history, render=render)
            if len(R2.blocking) <= len(R.blocking): plan, R = plan2, R2   # keep the better of the two
            else: log.append('the fixed plan was worse; kept the first one')
    if R.blocking:   # 4. fallback
        plan, R = fallback.repair(plan, cat, faces, history, render=render)
        plan = fallback.clean(plan)
        if style == 'editorial':   # a dropped card gives its time back to the talking head: bring its subtitles back
            subs = assemble.subtitles(inp, [(s['t0'], s['t1']) for s in plan['scenes']])
            if subs != plan['subtitles']:
                plan['subtitles'] = subs
                plan['fallbackLog'].append('subtitles rebuilt around the remaining cards')
                R, _ = validate.validate(plan, cat, faces, history, render=render)
    status = 'ok' if answer is not None else 'no-plan'
    json.dump(plan, open(os.path.join(out, 'plan.json'), 'w'), ensure_ascii=False, indent=1)
    json.dump({'status': status, 'log': log, 'fallback': plan.get('fallbackLog', []), 'issues': R.issues},
              open(os.path.join(out, 'report.json'), 'w'), ensure_ascii=False, indent=1)
    json.dump({'clip': inp['clip'].get('file'), 'duration_s': inp['clip']['duration'], 'style': style, 'status': status,
               'calls': calls, 'time': time.strftime('%Y-%m-%dT%H:%M:%S')}, open(os.path.join(out, 'run.json'), 'w'), ensure_ascii=False, indent=1)
    return plan, R, log


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 3: sys.exit(__doc__)
    opt = lambda k: a[a.index(k) + 1] if k in a else None
    load = lambda k: json.load(open(opt(k))) if opt(k) else None
    res = run(json.load(open(a[0])), a[1], a[2], faces=load('--faces'), render='--no-render' not in a, dry='--dry' in a,
              answer=load('--answer'), fix_answer=load('--fix-answer'))
    if res is None: print('request written to', os.path.join(a[2], 'request.json')); sys.exit(0)
    plan, R, log = res
    for line in log + [f'fixed: {x}' for x in plan.get('fallbackLog', [])]: print(line)
    for i in R.issues: print(f"{i['level']:5} {i['code']:16} {i['where']}: {i['msg']}")
    print('READY' if not R.blocking else 'BLOCKED', f"({len(plan['scenes'])} scenes) → {os.path.join(a[2], 'plan.json')}")

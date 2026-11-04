#!/usr/bin/env python3
"""Plan D for one clip, start to finish: ask the AI for a plan, check it, one fix round, then the fallback.

usage: plan_d.py <input.json> <editorial|overlay> <out_dir> [--faces faces.json] [--no-render]
                 [--dry] [--answer answer.json] [--fix-answer answer.json] [--code-answer c.json] [--fix-code-answer c.json]
  --dry          write out_dir/request.json (what would be sent) and stop: no API key needed
  --answer       use this answer instead of calling the API (tests, replays); --fix-answer is the answer to the fix round;
                 --code-answer / --fix-code-answer do the same for the scene-code call
writes out_dir/plan.json (ready for plan2timeline.py), out_dir/report.json (issues left, what the fallback changed)
and out_dir/run.json (every API call with its token usage, in the cost_model.py "calls" format).

Steps (DECISIONS 2 and 5):
  1. request from prompt.py — Sonnet 5.5, effort low, cached system block, answer forced into JSON by a schema
  2. if the plan has AI-written scenes (part "custom", Friend 2026-11-04: on from day one, no cap), a second call
     writes their code with the kit (prompt/kit.md); custom_check.py and the render check judge it like any part
  3. assemble.py → plan → validate.py (with the render check)
  4. any error → ONE fix round in the conversation that made it: plan errors to the plan call (its custom scenes are
     then written again), scene-code errors to the code call (the answer is passed back unchanged, then the issues)
  5. still blocking → fallback.py (B14 text cards, drops); quality errors that remain are reported, the clip is made
     report.json lists what the AI said the library was missing (`library_missing`), to grow the library
  6. no answer at all (API down, refusal) → a plan with subtitles and no scenes, so the customer still gets a clip
The API key comes from the environment (ANTHROPIC_API_KEY, set in the environment settings — never in chat or code).
"""
import copy, json, os, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import prompt, assemble, validate, fallback


def save(path, data):
    with open(path, 'w') as f: json.dump(data, f, ensure_ascii=False, indent=1)


def call_record(resp, model, stage='scene'):
    u = resp.usage
    return {'stage': stage, 'model': model, 'served': resp.model, 'in': u.input_tokens, 'out': u.output_tokens,
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
    except TypeError as e:   # the SDK raises this before sending when it finds no key, token or profile at all
        if 'authentication' in str(e).lower(): return None, None, 'no API key in the environment'
        raise
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


def write_codes(client, inp, style, answer, cat, calls, log, code_answer=None):
    """Step 2b (DECISIONS 2, step 5): when the plan has AI-written scenes, a second call writes their code into
    `answer` (in place). Returns (request, response) so a fix round can continue that conversation."""
    if not any(s.get('part') == 'custom' for s in answer.get('scenes', [])): return None, None
    req, resp = prompt.code_request(inp, style, answer, cat), None
    if code_answer is None and client is not None:
        code_answer, resp, why = ask(client, req)
        if resp is not None: calls.append(call_record(resp, req['model'], 'custom_scene'))
        if why: log.append(f'scene-code request failed: {why}')
    for c in (code_answer or {}).get('scenes', []):
        if isinstance(c.get('i'), int) and 0 <= c['i'] < len(answer['scenes']) and answer['scenes'][c['i']].get('part') == 'custom':
            answer['scenes'][c['i']]['code'] = c.get('code', '')
    return req, resp


def run(inp, style, out, faces=None, render=True, dry=False, answer=None, fix_answer=None, code_answer=None, fix_code_answer=None,
        client=None):
    """client: an anthropic.Anthropic() made here when None (tests pass a stand-in with the same beta.messages.create)."""
    os.makedirs(out, exist_ok=True)
    cat = prompt.load_catalog()
    req = prompt.request(inp, style, cat)
    if dry:
        save(os.path.join(out, 'request.json'), req)
        return None
    history = inp.get('history')
    calls, log, resp = [], [], None
    offline = answer is not None
    if offline: client = None
    else:
        if client is False:   # the caller forbids API calls (a replay with no saved answer)
            client = None; log.append('API not used: no saved answer to replay')
        elif client is None:
            try:
                import anthropic
                client = anthropic.Anthropic()
            except Exception as e:   # no key or no SDK: the clip still gets made, with subtitles only (step 6)
                log.append(f'no API client ({type(e).__name__}: {e})')
        why = 'no API client'
        if client is not None:
            answer, resp, why = ask(client, req)
            if resp is not None: calls.append(call_record(resp, req['model']))
            if why: log.append(f'plan request failed: {why}')
        if why and why.startswith('bad request'):   # most likely the answer schema: ask once more without it
            req = without_schema(req)
            answer, resp, why = ask(client, req)
            if resp is not None: calls.append(call_record(resp, req['model']))
            log.append('asked again without the schema' + (f': {why}' if why else ''))
    creq, cresp = write_codes(client, inp, style, answer, cat, calls, log, code_answer) if answer else (None, None)
    plan = assemble.assemble(inp, answer or {'camera': [], 'scenes': []}, style)
    R, _ = validate.validate(plan, cat, faces, history, render=render)
    errors = [i for i in R.issues if i['level'] == 'error']
    if answer is not None and errors:   # 3. one fix round, sent to the call that made the mistake
        code_errs = [i for i in errors if 'scene' in i and plan['scenes'][i['scene']]['part'] == 'custom']
        plan_errs = [i for i in errors if i not in code_errs]
        fixed = None
        if plan_errs:
            log.append(f'fix round (plan): {len(plan_errs)} errors sent back')
            fixed = copy.deepcopy(fix_answer) if fix_answer is not None else None
            if fixed is None and client is not None and resp is not None:
                req2 = dict(req, messages=req['messages'] + [{'role': 'assistant', 'content': resp.content},
                                                              {'role': 'user', 'content': prompt.fix_message(errors)}])
                fixed, resp2, why = ask(client, req2)
                if resp2 is not None: calls.append(call_record(resp2, req['model']))
                if why: log.append(f'fix request failed: {why}')
            if fixed is not None:   # offline replays reuse the given scene code unless a fix code is given
                write_codes(client, inp, style, fixed, cat, calls, log, (fix_code_answer if fix_code_answer is not None else code_answer) if offline else None)
        elif code_errs:
            log.append(f'fix round (scene code): {len(code_errs)} errors sent back')
            fixed = copy.deepcopy(answer)
            new_codes = fix_code_answer
            if new_codes is None and client is not None and cresp is not None:
                rows = [dict(i, where=f"scene {i['scene']}: {i['where']}") for i in code_errs]
                creq2 = dict(creq, messages=creq['messages'] + [{'role': 'assistant', 'content': cresp.content},
                                                                {'role': 'user', 'content': prompt.fix_message(rows)}])
                new_codes, cresp2, why = ask(client, creq2)
                if cresp2 is not None: calls.append(call_record(cresp2, creq['model'], 'custom_scene'))
                if why: log.append(f'scene-code fix failed: {why}')
            for c in (new_codes or {}).get('scenes', []):
                if isinstance(c.get('i'), int) and 0 <= c['i'] < len(fixed['scenes']) and fixed['scenes'][c['i']].get('part') == 'custom':
                    fixed['scenes'][c['i']]['code'] = c.get('code', '')
            if new_codes is None: fixed = None
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
    needs = [s.get('need') for s in (answer or {}).get('scenes', []) if s.get('part') == 'custom' and s.get('need')]   # kept even if the scene fell back
    save(os.path.join(out, 'plan.json'), plan)
    save(os.path.join(out, 'report.json'), {'status': status, 'log': log, 'fallback': plan.get('fallbackLog', []), 'library_missing': needs, 'issues': R.issues})
    save(os.path.join(out, 'run.json'), {'clip': inp['clip'].get('file'), 'duration_s': inp['clip']['duration'], 'style': style, 'status': status,
                                         'calls': calls, 'time': time.strftime('%Y-%m-%dT%H:%M:%S')})
    return plan, R, log

if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 3: sys.exit(__doc__)
    opt = lambda k: a[a.index(k) + 1] if k in a else None
    load = lambda k: json.load(open(opt(k))) if opt(k) else None
    res = run(json.load(open(a[0])), a[1], a[2], faces=load('--faces'), render='--no-render' not in a, dry='--dry' in a,
              answer=load('--answer'), fix_answer=load('--fix-answer'), code_answer=load('--code-answer'), fix_code_answer=load('--fix-code-answer'))
    if res is None: print('request written to', os.path.join(a[2], 'request.json')); sys.exit(0)
    plan, R, log = res
    for line in log + [f'fixed: {x}' for x in plan.get('fallbackLog', [])]: print(line)
    for i in R.issues: print(f"{i['level']:5} {i['code']:16} {i['where']}: {i['msg']}")
    print('READY' if not R.blocking else 'BLOCKED', f"({len(plan['scenes'])} scenes) → {os.path.join(a[2], 'plan.json')}")

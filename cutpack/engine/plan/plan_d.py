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
    w1h = getattr(getattr(u, 'cache_creation', None), 'ephemeral_1h_input_tokens', None) or 0   # the 1-hour writes cost more
    return {'stage': stage, 'model': model, 'served': resp.model, 'in': u.input_tokens, 'out': u.output_tokens,
            'cache_read': u.cache_read_input_tokens or 0, 'cache_write_5m': (u.cache_creation_input_tokens or 0) - w1h,
            'cache_write_1h': w1h, 'stop': resp.stop_reason}


def cache_ttl(state, style, now=None, every=2):
    """'1h' when at least `every` plans of this style started in the last hour, else '5m' (Friend 2026-11-05). A 5-minute
    write costs 1.25× the input price and an hour's 2×; reads 0.1×. With clips more than 5 minutes apart, an hour's cache
    is cheaper from the second clip of the hour; in a quiet hour it costs one clip about 1.3 baht more (overlay)."""
    now = time.time() if now is None else now
    times = (load_state(state).get(style) or []) if state else []
    return '1h' if sum(now - t < 3600 for t in times) >= every else '5m'


def load_state(state):
    try:
        with open(state) as f: return json.load(f)
    except (OSError, ValueError): return {}


def note_plan(state, style, now=None):
    """Remember when a plan of this style started (the last hour only), for cache_ttl."""
    if not state: return
    now = time.time() if now is None else now
    d = load_state(state)
    d[style] = [t for t in d.get(style, []) if now - t < 3600] + [now]
    os.makedirs(os.path.dirname(os.path.abspath(state)), exist_ok=True)
    with open(state, 'w') as f: json.dump(d, f)


PRICES = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'cost-test')


def worst_usd(req):
    """The most this request can cost: every input character as a token at the full input price (no cache), plus
    max_tokens of output — an over-estimate on purpose."""
    sys.path.insert(0, PRICES); import cost_model
    chars = len(json.dumps([req.get('system'), req.get('messages')], ensure_ascii=False, default=str))
    return cost_model.call_usd({'stage': 'scene', 'model': req['model'], 'in': chars, 'out': req.get('max_tokens', 16000)})


def budget_check(req):
    """With $CUTPACK_BUDGET_USD and $CUTPACK_LEDGER set (test runs), refuse a call that could take the ledger past the
    budget (real-key test 2026-11-05: a check only between clips let a test pass Friend's 4 USD line). → why or None"""
    budget, ledger = os.environ.get('CUTPACK_BUDGET_USD'), os.environ.get('CUTPACK_LEDGER')
    if not budget or not ledger: return None
    spent = load_state(ledger).get('usd', 0.0)
    if spent + worst_usd(req) > float(budget): return f'budget: {spent:.4f} spent, the next call could pass {float(budget):.2f} USD'
    return None


def ledger_add(resp, req):
    ledger = os.environ.get('CUTPACK_LEDGER')
    if not ledger or resp is None: return
    sys.path.insert(0, PRICES); import cost_model
    d = load_state(ledger); d['usd'] = d.get('usd', 0.0) + cost_model.call_usd(call_record(resp, req['model']))
    with open(ledger, 'w') as f: json.dump(d, f)


def ask(client, req):
    """One API call → (answer dict or None, the response, why it failed)."""
    import anthropic
    why = budget_check(req)
    if why: return None, None, why
    try:
        resp = client.beta.messages.create(**req)
        ledger_add(resp, req)
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
    try: return prompt.slots_to_dict(json.loads(text)), resp, None
    except json.JSONDecodeError: return None, resp, 'answer is not JSON'


def without_schema(req):
    """The same request without output_config.format, asking for bare JSON instead (used once if the API refuses the
    schema: it has not been tried against the API yet — no key in this environment when it was written)."""
    r = dict(req, output_config={'effort': req['output_config']['effort']})
    ask_json = '\n\nAnswer with only the JSON object {"camera": [...], "scenes": [...]} in the format of the example, nothing else.'
    r['messages'] = [dict(req['messages'][0], content=req['messages'][0]['content'] + ask_json)]
    return r


# Errors the plan cannot change: the caption step makes the subtitle chunks and the face finder sets the subtitle height.
# Sending them back only paid for a fix round that could not fix them (real-key test 2026-11-05: 28 left after the fix).
# In overlay the subtitles are the captions as they are, so a chunk shown too fast is not the plan's either.
NOT_THE_PLANS = {'sub-chunk', 'sub-top'}


def plan_can_fix(issue, style):
    return issue['code'] not in NOT_THE_PLANS and not (style == 'overlay' and issue['code'] == 'sub-fast')


def write_codes(client, inp, style, answer, cat, calls, log, code_answer=None, raw=None, key='code'):
    """Step 2b (DECISIONS 2, step 5): when the plan has AI-written scenes, a second call writes their code into
    `answer` (in place). Returns (request, response) so a fix round can continue that conversation."""
    if not any(s.get('part') == 'custom' for s in answer.get('scenes', [])): return None, None
    req, resp = prompt.code_request(inp, style, answer, cat), None
    if code_answer is None and client is not None:
        code_answer, resp, why = ask(client, req)
        if resp is not None: calls.append(call_record(resp, req['model'], 'custom_scene'))
        if why: log.append(f'scene-code request failed: {why}')
        if raw is not None and code_answer is not None: raw[key] = copy.deepcopy(code_answer)
    for c in (code_answer or {}).get('scenes', []):
        if isinstance(c.get('i'), int) and 0 <= c['i'] < len(answer['scenes']) and answer['scenes'][c['i']].get('part') == 'custom':
            answer['scenes'][c['i']]['code'] = c.get('code', '')
    return req, resp


def run(inp, style, out, faces=None, render=True, dry=False, answer=None, fix_answer=None, code_answer=None, fix_code_answer=None,
        client=None, ttl='5m', model=None, thinking=None):
    """client: an anthropic.Anthropic() made here when None (tests pass a stand-in with the same beta.messages.create)."""
    os.makedirs(out, exist_ok=True)
    cat = prompt.load_catalog()
    req = prompt.request(inp, style, cat, ttl=ttl, model=model, thinking=thinking)
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
    raw = {}   # the API's answers as they came, saved for replays that cost nothing (run_clip.py --answers)
    if answer is not None and not offline: raw['answer'] = copy.deepcopy(answer)
    creq, cresp = write_codes(client, inp, style, answer, cat, calls, log, code_answer, raw) if answer else (None, None)
    plan = assemble.assemble(inp, answer or {'camera': [], 'scenes': []}, style)
    R, _ = validate.validate(plan, cat, faces, history, render=render)
    errors = [i for i in R.issues if i['level'] == 'error' and plan_can_fix(i, style)]
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
                if fixed is not None: raw['fix'] = copy.deepcopy(fixed)
            if fixed is not None:   # offline replays reuse the given scene code unless a fix code is given
                write_codes(client, inp, style, fixed, cat, calls, log, (fix_code_answer if fix_code_answer is not None else code_answer) if offline else None,
                            raw, 'fixcode')
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
                if new_codes is not None: raw['fixcode'] = copy.deepcopy(new_codes)
            for c in (new_codes or {}).get('scenes', []):
                if isinstance(c.get('i'), int) and 0 <= c['i'] < len(fixed['scenes']) and fixed['scenes'][c['i']].get('part') == 'custom':
                    fixed['scenes'][c['i']]['code'] = c.get('code', '')
            if new_codes is None: fixed = None
        if fixed is not None:
            plan2 = assemble.assemble(inp, fixed, style)
            R2, _ = validate.validate(plan2, cat, faces, history, render=render)
            # keep the better of the two. A plan with no scenes has nothing to block, but it is never the better one: the
            # fallback can repair a plan with scenes (real-key test 2026-11-05: an empty first answer was kept, 0 widgets)
            if not plan['scenes'] and plan2['scenes']: plan, R = plan2, R2; log.append('the first plan was empty; kept the fixed one')
            elif len(R2.blocking) <= len(R.blocking) and (plan2['scenes'] or not plan['scenes']): plan, R = plan2, R2
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
    for k, v in raw.items(): save(os.path.join(out, f'{k}.json'), v)   # answer, fix, code, fixcode
    save(os.path.join(out, 'report.json'), {'status': status, 'topic': plan.get('topic', 'none'), 'log': log, 'fallback': plan.get('fallbackLog', []), 'library_missing': needs, 'issues': R.issues})
    save(os.path.join(out, 'run.json'), {'clip': inp['clip'].get('file'), 'duration_s': inp['clip']['duration'], 'style': style, 'status': status, 'topic': plan.get('topic', 'none'),
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

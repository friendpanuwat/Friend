#!/usr/bin/env python3
"""Plan-D test runs with a Claude subagent standing in for the API (Friend 2026-11-06: no API key in this chat; the aim
is to see the quality of the ways to plan better without thinking). The request is the one plan_d.py would send,
byte for byte; a subagent of the same model reads it from files and writes the answer, and the rest is the normal
engine: assemble, mend, checker, fix round (Haiku subagent), fallback, render.

usage (from anywhere; WAYS = '' for today's default, or a comma list of prompt.WAYS, or 'all'):
  sa.py ask   <input.json> <style> <WAYS> <ask_dir>                 write the first plan request for a subagent
  sa.py step  <input.json> <faces.json> <style> <WAYS> <ans_dir> <ask_dir> <out_dir>
        run plan_d with the answers in ans_dir (answer.json, code.json, fix.json, fixcode.json). If the engine needs one
        more answer (scene code, fix round), its request is written to ask_dir and the name to save it under is printed
        (PENDING <name>); otherwise the plan is final in out_dir (DONE)
  sa.py take  <ask_dir> <ans_dir>/<name>.json                       the subagent's answer.raw.json → the engine's form
  sa.py render <clip.mp4> <base_dir> <out_dir>                      out_dir/plan.json → edit.mp4 (frames freed after)

ask_dir holds: request.json (the whole request), system_N.txt (the system prompt in parts the Read tool can open),
messages_N_<role>.txt (the conversation), schema.json (the answer's JSON schema), model.txt; the subagent writes
answer.raw.json there.
"""
import copy, json, os, shutil, sys

ENGINE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'engine')
sys.path.insert(0, os.path.join(ENGINE, 'plan'))
sys.path.insert(0, ENGINE)
PART = 12000   # characters per system part


def save(path, data):
    with open(path, 'w') as f: json.dump(data, f, ensure_ascii=False, indent=1)


def load(path):
    with open(path) as f: return json.load(f)


def maybe(path):
    return load(path) if os.path.exists(path) else None


def text_of(content):
    if isinstance(content, str): return content
    return '\n'.join(b.get('text', '') if isinstance(b, dict) else getattr(b, 'text', '') for b in content)


def short_lines(text, most=1500):
    """The Read tool cuts lines longer than about 2,000 characters. A long line here is an example answer (one JSON
    object): put one scene per line. Only whitespace between JSON tokens changes, so it is the same JSON."""
    out = []
    for line in text.split('\n'):
        if len(line) > most and line.startswith('{'):
            try: obj = json.loads(line)
            except json.JSONDecodeError: obj = None
            if isinstance(obj, dict) and isinstance(obj.get('scenes'), list):
                d = lambda x: json.dumps(x, ensure_ascii=False, separators=(',', ':'))
                head = ','.join(f'{d(k)}:{d(v)}' for k, v in obj.items() if k != 'scenes')
                out.append('{' + head + ',"scenes":[')
                out += [d(s) + (',' if i < len(obj['scenes']) - 1 else '') for i, s in enumerate(obj['scenes'])]
                out.append(']}')
                continue
        out.append(line)
    return '\n'.join(out)


def write_ask(req, ask_dir):
    """The request as files a subagent can read in order."""
    if os.path.exists(ask_dir): shutil.rmtree(ask_dir)
    os.makedirs(ask_dir)
    save(os.path.join(ask_dir, 'request.json'), req)
    system = short_lines(text_of(req['system']))
    parts, cur = [], ''
    for line in system.split('\n'):
        if len(cur) + len(line) + 1 > PART and cur: parts.append(cur); cur = ''
        cur += line + '\n'
    parts.append(cur)
    for i, p in enumerate(parts, 1):
        with open(os.path.join(ask_dir, f'system_{i}.txt'), 'w') as f: f.write(p)
    for i, m in enumerate(req['messages'], 1):
        with open(os.path.join(ask_dir, f"messages_{i}_{m['role']}.txt"), 'w') as f: f.write(short_lines(text_of(m['content'])))
    schema = req.get('output_config', {}).get('format', {}).get('schema')
    if schema: save(os.path.join(ask_dir, 'schema.json'), schema)
    with open(os.path.join(ask_dir, 'model.txt'), 'w') as f:
        f.write(f"{req['model']} · effort {req.get('output_config', {}).get('effort')} · thinking {req.get('thinking', {}).get('type', 'default')}\n")
    return len(parts)


class Capture:
    """A client that sends nothing: it keeps each request and answers as if the network were down."""
    def __init__(self):
        from types import SimpleNamespace as NS
        self.requests = []
        self.beta = NS(messages=NS(create=self.create))

    def create(self, **req):
        import anthropic, httpx
        self.requests.append(copy.deepcopy(req))
        raise anthropic.APIConnectionError(request=httpx.Request('POST', 'https://stand-in.invalid/v1/messages'))


def kind(req):
    props = req.get('output_config', {}).get('format', {}).get('schema', {}).get('properties', {})
    if 'camera' not in props: return 'fixcode' if len(req['messages']) > 1 else 'code'
    return 'fix' if len(req['messages']) > 1 else 'answer'


def main(a):
    cmd = a[0]
    if cmd == 'ask':
        inp, style, ways, ask_dir = load(a[1]), a[2], a[3], a[4]
        import prompt
        n = write_ask(prompt.request(inp, style, ways=ways), ask_dir)
        print(f'ASK answer ({n} system parts) → {ask_dir}')
    elif cmd == 'step':
        inp, faces, style, ways, ans, ask_dir, out = load(a[1]), load(a[2]), a[3], a[4], a[5], a[6], a[7]
        os.environ['CUTPACK_PLAN_WAYS'] = ways   # the fix round's request is built inside plan_d with the same ways
        import plan_d
        A = lambda n: maybe(os.path.join(ans, f'{n}.json'))
        if A('answer') is None: sys.exit('no answer.json yet: run ask first')
        cl = Capture()
        plan, R, log = plan_d.run(inp, style, out, faces=faces, answer=A('answer'), fix_answer=A('fix'), code_answer=A('code'),
                                  fix_code_answer=A('fixcode'), client=cl, fix_live=True)
        wanted = [r for r in cl.requests if A(kind(r)) is None]
        if wanted:
            write_ask(wanted[0], ask_dir)
            print(f'PENDING {kind(wanted[0])} → {ask_dir}')
            return
        for line in log: print('  ' + line)
        print(f"DONE {len(plan['scenes'])} scenes, {len(R.blocking)} blocking left, fallback {len(plan.get('fallbackLog', []))} → {out}")
    elif cmd == 'take':
        ask_dir, dest = a[1], a[2]
        import prompt
        with open(os.path.join(ask_dir, 'answer.raw.json')) as f: text = f.read().strip()
        if text.startswith('```'): text = text.split('\n', 1)[1].rsplit('```', 1)[0]
        ans = json.loads(text)
        if 'scenes' not in ans: sys.exit('the answer has no scenes')
        if 'camera' in ans: ans = prompt.slots_to_dict(ans)   # a plan (not scene code): slots as one object, as plan_d keeps it
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        save(dest, ans)
        print(f"TOOK {len(ans['scenes'])} scenes → {dest}")
    elif cmd == 'flow':   # flow <repo clip dir> <work clip dir> <variant> <style> <WAYS> [--render <clip.mp4>]
        repo, work, var, style, ways = a[1], a[2], a[3], a[4], a[5]
        ans, here = os.path.join(repo, var, style), os.path.join(work, var, style)
        os.makedirs(ans, exist_ok=True)
        if not os.path.exists(os.path.join(ans, 'answer.json')):
            if not os.path.exists(os.path.join(here, 'ask', 'answer.raw.json')): print('WAITING answer', os.path.join(here, 'ask')); return
            main(['take', os.path.join(here, 'ask'), os.path.join(ans, 'answer.json')])
        while True:
            pend = os.path.join(here, 'pending.txt')
            if os.path.exists(pend):   # an answer asked for by the last step: take it if the subagent wrote it
                k = open(pend).read().strip()
                raw = os.path.join(here, f'ask_{k}', 'answer.raw.json')
                if not os.path.exists(raw): print('WAITING', k, os.path.dirname(raw)); return
                main(['take', os.path.dirname(raw), os.path.join(ans, f'{k}.json')]); os.remove(pend)
            import io, contextlib
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                main(['step', os.path.join(repo, 'input.json'), os.path.join(repo, 'faces.json'), style, ways, ans,
                      os.path.join(here, 'ask_next'), os.path.join(here, 'out')])
            s = buf.getvalue()
            if s.startswith('PENDING'):
                k = s.split()[1]
                nxt, dst = os.path.join(here, 'ask_next'), os.path.join(here, f'ask_{k}')
                if os.path.exists(dst): shutil.rmtree(dst)
                os.rename(nxt, dst)
                with open(pend, 'w') as f: f.write(k)
                print('PENDING', k, dst, open(os.path.join(dst, 'model.txt')).read().strip()); return
            print(s.strip())
            for n in ('plan.json', 'report.json'): shutil.copyfile(os.path.join(here, 'out', n), os.path.join(ans, n))
            break
        if '--render' in a:
            main(['render', a[a.index('--render') + 1], os.path.join(work, 'base'), os.path.join(here, 'out')])
    elif cmd == 'render':
        import run_clip
        clip, base, out = a[1], a[2], a[3]
        mp4 = run_clip.render(clip, base, out, load(os.path.join(out, 'plan.json')))
        shutil.rmtree(os.path.join(out, 'out_frames'), ignore_errors=True)   # the frames are in the MP4 now: free the disk
        print('RENDERED', mp4, round(os.path.getsize(mp4) / 1e6, 1), 'MB')
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1:])

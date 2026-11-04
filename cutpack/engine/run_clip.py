#!/usr/bin/env python3
"""CutPack: one raw clip in, finished MP4s out — every step of DECISIONS 2 in order, with times and cost logged.

usage: run_clip.py <clip.mp4> <work_dir> [--styles editorial,overlay] [--customer id] [--history history.json]
                   [--words words.json] [--captions captions.json] [--stop-after captions|plan]
                   [--answers dir] [--rules-captions] [--log runs.jsonl] [--threads 2]

  1. frames    pipeline.sh frames → work/base (1080×1920 frames, cleaned voice)
  2. words     Typhoon ASR Realtime on our machine (plan/asr.py)          --words: use this transcript instead
  3. captions  Claude Haiku 5.5 groups lines and "/" chunks (plan/captions.py), by rule when there is no key
               --captions: the customer's checked captions (web app step 4); the text on screen is then theirs
               --stop-after captions: stop here so the captions can be checked, then run again with --captions
  4. faces     plan/faces.py → where the face is, where widgets and subtitles go
  5. plan      plan/plan_d.py per style: Claude Sonnet 5.5 plans, checker, one fix round, fallback
               --answers dir: replay saved answers instead of calling the API (<style>.answer.json, <style>.fix.json,
               <style>.code.json, <style>.fixcode.json, captions.answer.json) — tests and re-runs cost nothing
  6. render    plan2timeline → pipeline.sh build render audio encode → work/<style>/edit.mp4
  7. log       one line per style in runs.jsonl (cost_model.py format, plus the seconds of each step):
               python3 cost-test/cost_model.py report runs.jsonl
The caption call is counted in each style's line: a customer gets one style per clip, so each line is one clip's cost.
API key: ANTHROPIC_API_KEY in the environment settings (never in chat or code). With no key the clip is still made:
captions by rule and subtitles only, no scenes (status "no-plan" in the log).
"""
import json, os, shutil, subprocess, sys, time

ENGINE = os.path.dirname(os.path.abspath(__file__))
PIPE = os.path.join(ENGINE, 'core', 'pipeline.sh')
sys.path.insert(0, os.path.join(ENGINE, 'plan'))
import captions as captions_step, plan_d, plan2timeline

STYLES = ('editorial', 'overlay')


def sh(*args, cwd=None):
    r = subprocess.run(list(args), cwd=cwd, capture_output=True, text=True)
    if r.returncode: raise RuntimeError(f"{' '.join(map(str, args[:3]))} failed:\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}")
    return r.stdout


def duration(path):
    return round(float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path).strip()), 3)


def load(path, key):
    """A file that is either the list itself or an object holding it under `key`."""
    d = json.load(open(path))
    return d[key] if isinstance(d, dict) else d


def save(path, data):
    with open(path, 'w') as f: json.dump(data, f, ensure_ascii=False, indent=1)


def maybe(path):
    return json.load(open(path)) if path and os.path.exists(path) else None


class Timer:
    def __init__(self): self.s = {}
    def __call__(self, name):
        t = self
        class Ctx:
            def __enter__(s): s.t0 = time.time()
            def __exit__(s, *e): t.s[name] = round(t.s.get(name, 0) + time.time() - s.t0, 1)
        return Ctx()


def render(clip, base, out, plan):
    """plan → out/edit.mp4 with the engine, on the frames and voice made once in base."""
    with open(os.path.join(out, 'timeline.js'), 'w') as f: f.write(plan2timeline.convert(plan))
    for name in ('src_frames', 'voice.wav', '.hold'):
        src, dst = os.path.join(base, name), os.path.join(out, name)
        if os.path.exists(src) and not os.path.lexists(dst): os.symlink(src, dst)
    for step in ('build', 'render', 'audio', 'encode'):
        sh('bash', PIPE, out, clip, step)
    return os.path.join(out, 'edit.mp4')


def run(clip, work, styles=STYLES, customer='test', history=None, words_file=None, captions_file=None, stop_after=None,
        answers=None, rules_captions=False, log_path=None, threads=2, client=None):
    clip, work = os.path.abspath(clip), os.path.abspath(work)
    base = os.path.join(work, 'base'); os.makedirs(base, exist_ok=True)
    T, notes = Timer(), []
    dur = duration(clip)
    A = lambda name: maybe(os.path.join(answers, name)) if answers else None
    if client is None and not answers and os.environ.get('ANTHROPIC_API_KEY'):
        import anthropic
        client = anthropic.Anthropic()

    with T('frames'): sh('bash', PIPE, base, clip, 'frames')

    asr_calls = []
    with T('words'):
        if words_file: words = load(words_file, 'words'); notes.append(f'words from {os.path.basename(words_file)}')
        else:
            import asr
            res = asr.transcribe(clip, threads)
            words = res['words']
            asr_calls.append({'stage': 'asr', 'provider': 'local-typhoon-realtime', 'audio_s': res['audio_s']})
    save(os.path.join(work, 'words.json'), {'words': words})

    with T('captions'):
        if captions_file:
            caps, info = load(captions_file, 'captions'), {'source': 'customer', 'log': [], 'calls': []}
        elif answers:   # replay: a saved answer or the rule grouping, never the API
            cap_answer = None if rules_captions else A('captions.answer.json')
            caps, info = captions_step.run(words, dur, client=False, answer=cap_answer, use_ai=cap_answer is not None)
        else:
            caps, info = captions_step.run(words, dur, client=client, use_ai=not rules_captions)
    save(os.path.join(work, 'captions.json'), dict(captions=caps, **info))
    notes += info['log']
    if stop_after == 'captions':
        return {'stopped': 'captions', 'captions': os.path.join(work, 'captions.json'), 'notes': notes}

    with T('faces'):
        import faces as faces_step
        files, boxes = faces_step.detect(os.path.join(base, 'src_frames'))
        faces = faces_step.layout(boxes, len(files))
    save(os.path.join(work, 'faces.json'), faces)

    inp = {'clip': {'file': os.path.basename(clip), 'duration': dur, 'customer': customer},
           'words': words, 'captions': caps, 'layout': faces['layout'], 'history': history or {'clips': []}}
    save(os.path.join(work, 'input.json'), inp)

    results = {}
    for style in styles:
        out = os.path.join(work, style); os.makedirs(out, exist_ok=True)
        st = Timer()
        with st('plan'):
            res = plan_d.run(inp, style, out, faces=faces, answer=A(f'{style}.answer.json'), fix_answer=A(f'{style}.fix.json'),
                             code_answer=A(f'{style}.code.json'), fix_code_answer=A(f'{style}.fixcode.json'),
                             client=False if answers else client)   # replay with no saved answer: subtitles only
        plan, R, plog = res
        report = json.load(open(os.path.join(out, 'report.json')))
        mp4, err = None, None
        if stop_after != 'plan':
            try:
                with st('render'): mp4 = render(clip, base, out, plan)
            except RuntimeError as e:
                err = str(e)
        made = mp4 is not None and os.path.exists(mp4)
        planned = report['status'] == 'ok'
        if stop_after == 'plan': status = 'planned' if planned else 'no-plan'
        else: status = ('ok' if planned else 'no-plan') if made else 'fail'
        # cost_model: a delivered clip is "ok" even with subtitles only; only a clip that could not be made is refunded
        stages = dict(T.s, **st.s)
        rec = {'clip': f"{os.path.splitext(os.path.basename(clip))[0]}:{style}", 'duration_s': dur, 'attempt': 0,
               'status': 'fail' if status == 'fail' else 'ok', 'detail': status, 'render_s': st.s.get('render', 0), 'stages': stages,
               'scenes': len(plan['scenes']), 'custom_scenes': sum(s.get('part') == 'custom' for s in plan['scenes']),
               'fallback': len(plan.get('fallbackLog', [])), 'blocking_left': len(R.blocking),
               'captions': info['source'], 'replay': bool(answers),
               'calls': asr_calls + info['calls'] + json.load(open(os.path.join(out, 'run.json')))['calls'],
               'time': time.strftime('%Y-%m-%dT%H:%M:%S')}
        if err: rec['error'] = err[:500]
        if log_path:
            prev = [json.loads(l) for l in open(log_path)] if os.path.exists(log_path) else []
            rec['attempt'] = sum(p['clip'] == rec['clip'] for p in prev)
            with open(log_path, 'a') as f: f.write(json.dumps(rec, ensure_ascii=False) + '\n')
        results[style] = {'mp4': mp4, 'status': status, 'record': rec, 'log': plog}
    return {'results': results, 'notes': notes, 'stages': T.s}


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2: sys.exit(__doc__)
    opt = lambda k: a[a.index(k) + 1] if k in a else None
    styles = tuple(opt('--styles').split(',')) if opt('--styles') else STYLES
    if any(s not in STYLES for s in styles): sys.exit(f'styles are {", ".join(STYLES)}')
    res = run(a[0], a[1], styles, customer=opt('--customer') or 'test', history=maybe(opt('--history')),
              words_file=opt('--words'), captions_file=opt('--captions'), stop_after=opt('--stop-after'),
              answers=opt('--answers'), rules_captions='--rules-captions' in a, log_path=opt('--log'),
              threads=int(opt('--threads') or 2))
    for n in res['notes']: print(n)
    if res.get('stopped'): print(f"stopped after captions: check {res['captions']}, then run again with --captions"); sys.exit(0)
    for style, r in res['results'].items():
        rec = r['record']
        print(f"{style:9s} {r['status']:7s} scenes {rec['scenes']} (custom {rec['custom_scenes']}, fallback changes {rec['fallback']})"
              f" · steps {rec['stages']} → {r['mp4']}")

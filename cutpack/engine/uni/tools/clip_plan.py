"""Turn the two AI answers (captions: Haiku · pictures: Sonnet) into a clip plan for the uni engine, by rule only (no choices).
usage: tools/clip_plan.py <web_dir> <faces.json>   (first try at step 4, 2026-11-11: a real clip with the web's two AI steps)
  in  <web_dir>/captions.json (captions.py), <web_dir>/cats/report.json + sentences.js (cat_ai.py check), lines.json (cat_ai ask)
  out <web_dir>/plan.js (FACES, CAPTIONS, SENTENCE with no words: every word is in CAPTIONS) and then.txt (scenes for build.py)
Rules: a picture covers its caption line; if the line is shorter than MIN s it runs on to the end of the next line(s);
a picture never runs into the next picture; the key word lands when its words are said (else the middle).
Subtitles: every chunk of every line, the last phrase of a chunk is the big word (captions.py: "the last phrase of a chunk is shown big")."""
import json, re, sys
W, FACES = sys.argv[1], sys.argv[2]
MIN = 2.4
cap = json.load(open(f'{W}/captions.json'))
lines, phrases = cap['captions'], cap['words']
rep = [r for r in json.load(open(f'{W}/cats/report.json')) if r['ok'] and r['cat'] != 'none']
flat = lambda s: re.sub(r'\s+', '', s)
# phrases of each caption line (in order, by time)
pi, line_ph = 0, []
for i, l in enumerate(lines):
    n = len(flat(l['text'].replace('/', '')))
    got, acc = [], ''
    while pi < len(phrases) and len(flat(acc)) < n:
        got.append(phrases[pi]); acc += phrases[pi]['w']; pi += 1
    line_ph.append(got)
# subtitles: one block per chunk
CAP = []
for i, l in enumerate(lines):
    ph = list(line_ph[i]); chunks = [c.strip().split(' ') for c in l['text'].split('/')]
    k = 0
    for ch in chunks:
        parts = ph[k:k + len(ch)]; k += len(ch)
        if parts: CAP.append({'t0': parts[0]['t0'], 'parts': [[p['w'], p['t0'], 'l'] for p in parts]})
    if k != len(ph): print('warning: line', i + 1, 'phrases', len(ph), 'chunk words', k)
for j, c in enumerate(CAP):
    c['parts'][-1][2] = 'k'
    c['t1'] = CAP[j + 1]['t0'] if j + 1 < len(CAP) else lines[-1]['t1']
# scenes
rep.sort(key=lambda r: r['line'])
scenes = []
for r in rep:
    n = r['line'] - 1; t0, e = lines[n]['t0'], n
    while lines[e]['t1'] - t0 < MIN and e + 1 < len(lines): e += 1
    scenes.append([r, t0, lines[e]['t1'], n])
for a, b in zip(scenes, scenes[1:]):
    if b[1] < a[2]: a[2] = b[1]                                  # never into the next picture (it then follows straight on)
scenes = [s for s in scenes if s[2] - s[1] >= 1.2]
then = []
for k, (r, t0, t1, n) in enumerate(scenes):
    key, hit = flat(r['key']), None
    for p in line_ph[n] + (line_ph[n + 1] if n + 1 < len(line_ph) else []):
        if flat(p['w']) and (flat(p['w']) in key or key in flat(p['w'])): hit = p['t0']; break
    if hit is None or not (t0 + .3 < hit < t1 - .3): hit = (t0 + t1) / 2
    then.append(f"{r['id']},{t0:.2f},{t1:.2f},{k},{hit:.2f}")
f = json.load(open(FACES))
js = f"const FACES = {json.dumps({'track': f['track'], 'layout': f['layout'], 'keepOut': f['keepOut']})};\nconst CAPTIONS = {json.dumps(CAP, ensure_ascii=False)};\n"
js += re.sub(r'"say": \[[^\]]*\]', '"say": ["", ""]', open(f'{W}/cats/sentences.js').read())
open(f'{W}/plan.js', 'w').write(js)
open(f'{W}/then.txt', 'w').write('\n'.join(then) + '\n')
print(len(CAP), 'subtitle blocks ·', len(then), 'scenes')
for t in then: print('  ', t)

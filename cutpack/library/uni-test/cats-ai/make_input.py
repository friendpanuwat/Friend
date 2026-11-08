#!/usr/bin/env python3
"""Test input for the category test (round 15): caption lines with times for 6 real scripts.
  4 clips from the real-clip tests (TikTok clips of other people; the same caption lines as rounds 4-5: ../ai2/<clip>/ask/user.txt)
  2 of Friend's own scripts from his skills (.claude/skills/minimal-talking-shorts*/examples/*/transcript.txt, chunks with
  whole-second times) grouped into caption-sized lines (a line ends at 14+ letters on a natural break, or at 22 letters).
usage: make_input.py <out_dir>   →  <out_dir>/<clip>/captions.json + durations.json"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
MARKS = set(range(0x0E31, 0x0E32)) | set(range(0x0E34, 0x0E3B)) | set(range(0x0E47, 0x0E4F))
glen = lambda s: sum(1 for ch in s if ord(ch) not in MARKS and not ch.isspace())

def from_user(path):
    caps, dur = [], None
    for l in open(path, encoding='utf-8'):
        m = re.match(r'Clip: ([\d.]+) seconds', l)
        if m: dur = float(m.group(1))
        m = re.match(r'\d+\. \[([\d.]+)-([\d.]+)\] (.*)', l.strip())
        if m: caps.append({'t0': float(m.group(1)), 't1': float(m.group(2)), 'text': m.group(3)})
    return caps, dur

def from_chunks(path):
    ch = []
    for l in open(path, encoding='utf-8'):
        m = re.match(r'(\d+):(\d+) (.*)', l.strip())
        if m: ch.append((int(m.group(1)) * 60 + int(m.group(2)), m.group(3)))
    end = ch[-1][0] + 1.5
    lines, cur = [], []
    for k, (t, w) in enumerate(ch):
        cur.append((t, w)); n = glen(''.join(x for _, x in cur))
        nxt = ch[k + 1][0] if k + 1 < len(ch) else end
        if n >= 22 or (n >= 14 and (nxt - t >= 1 or re.search(r'(เนี่ย|นะ|ครับ|ค่ะ|อ่ะ|แล้ว|ไหม|อยู่|ได้)$', w))) or k + 1 == len(ch):
            lines.append({'t0': float(cur[0][0]), 'text': ' '.join(x for _, x in cur)}); cur = []
    for i, l in enumerate(lines): l['t1'] = lines[i + 1]['t0'] if i + 1 < len(lines) else end
    for l in lines:                                  # whole-second chunks: a line never shorter than .8 s
        if l['t1'] - l['t0'] < .8: l['t1'] = l['t0'] + .8
    return lines, end

out = sys.argv[1]; durs = {}
for clip in ['105656', '114123', '115213', '115846']:
    caps, d = from_user(os.path.join(HERE, '..', 'ai2', clip, 'ask', 'user.txt')); durs[clip] = d
    os.makedirs(os.path.join(out, clip), exist_ok=True); json.dump(caps, open(os.path.join(out, clip, 'captions.json'), 'w'), ensure_ascii=False, indent=0)
for clip, p in [('customers', '.claude/skills/minimal-talking-shorts-overlay/examples/clip01-customers/transcript.txt'),
                ('retire', '.claude/skills/minimal-talking-shorts/examples/clip02-retire/transcript.txt')]:
    caps, d = from_chunks(os.path.join(ROOT, p)); durs[clip] = d
    os.makedirs(os.path.join(out, clip), exist_ok=True); json.dump(caps, open(os.path.join(out, clip, 'captions.json'), 'w'), ensure_ascii=False, indent=0)
json.dump(durs, open(os.path.join(out, 'durations.json'), 'w'), indent=1)
print(durs)

#!/usr/bin/env python3
"""Turn a transcript into timed chunks, snapped to real pauses in the audio.

usage: make_timeline.py <video.mp4> <transcript> <project_dir>
transcript = .srt file, or plain lines "MM:SS text" (CapCut auto-caption export style).
Writes <project>/chunks.json  [[start_sec, end_sec, "text"], ...]  and  <project>/chunks.md (table to plan from).
Timing model: transcript stamps are floor-seconds → chunks sharing a stamp split that second by text length;
each start then snaps to the end of a detected pause (≤0.45 s away). Fillers are kept — drop them when styling.
"""
import json, os, re, subprocess, sys


def ts(s):
    s = s.strip().replace(',', '.')
    p = [float(x) for x in s.split(':')]
    return p[0] * 3600 + p[1] * 60 + p[2] if len(p) == 3 else p[0] * 60 + p[1]


def parse(path):
    raw = open(path, encoding='utf-8-sig').read()
    if '-->' in raw:   # SRT: exact start/end per cue
        out = []
        for blk in re.split(r'\n\s*\n', raw.strip()):
            lines = [l for l in blk.splitlines() if l.strip()]
            for i, l in enumerate(lines):
                if '-->' in l:
                    a, b = l.split('-->')
                    out.append([ts(a), ts(b), ' '.join(lines[i + 1:]).strip()])
                    break
        return out, True
    out = []
    for l in raw.splitlines():
        m = re.match(r'\s*(\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d+)?)\s+(.+)', l)
        if m: out.append([ts(m.group(1)), None, m.group(2).strip()])
    return out, False


def pauses(video):
    r = subprocess.run(['ffmpeg', '-i', video, '-af', 'highpass=f=100,silencedetect=n=-30dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True)
    return [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', r.stderr)]


def main():
    video, tr, proj = sys.argv[1:4]
    os.makedirs(proj, exist_ok=True)
    rows, exact = parse(tr)
    if not rows: sys.exit('no timed lines found in transcript')
    gaps = pauses(video)
    if not exact:   # spread chunks that share a floor-second stamp
        i = 0
        while i < len(rows):
            j = i
            while j < len(rows) and rows[j][0] == rows[i][0]: j += 1
            nxt = rows[j][0] if j < len(rows) else rows[i][0] + 1
            span, tot, acc = max(1, nxt - rows[i][0]), sum(len(r[2]) for r in rows[i:j]), 0
            for k in range(i, j):
                rows[k][0] = rows[i][0] + span * acc / tot if k > i else rows[k][0]
                acc += len(rows[k][2])
            i = j
    for r in rows:
        near = [g for g in gaps if abs(g - r[0]) < .45]
        if near: r[0] = min(near, key=lambda g: abs(g - r[0]))
    rows.sort(key=lambda r: r[0])
    for k in range(len(rows)):
        if k and rows[k][0] <= rows[k - 1][0] + .15: rows[k][0] = rows[k - 1][0] + .25
        rows[k][0] = round(rows[k][0], 2)
    for k in range(len(rows)):   # ends after ALL starts are final (else an end can land before its start)
        if rows[k][1] is None or not exact: rows[k][1] = round(rows[k + 1][0] - .02, 2) if k + 1 < len(rows) else round(rows[k][0] + 1.0, 2)
    json.dump(rows, open(os.path.join(proj, 'chunks.json'), 'w'), ensure_ascii=False, indent=0)
    with open(os.path.join(proj, 'chunks.md'), 'w') as f:
        f.write('| # | start | end | text |\n|---|---|---|---|\n')
        for n, (a, b, t) in enumerate(rows): f.write(f'| {n} | {a:.2f} | {b:.2f} | {t} |\n')
    print(f'{len(rows)} chunks · {len(gaps)} pauses detected → {proj}/chunks.json, chunks.md')


if __name__ == '__main__':
    main()

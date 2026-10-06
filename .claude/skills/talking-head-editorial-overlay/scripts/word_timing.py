#!/usr/bin/env python3
"""Word-accurate chunk timing: Whisper word timestamps aligned to the user's transcript.

usage: word_timing.py <video> <transcript> <project_dir> [model]
The user's transcript stays the source of truth for the TEXT (Whisper's Thai spelling is often wrong);
Whisper only supplies WHEN each character was spoken. Chunk starts that could not be matched are interpolated
and marked "*" in chunks.md — check those against src_frames/mouth movement or the floor-second stamp.
Needs faster-whisper (pip) + the model download from huggingface.co (~800 MB, cached). Run with python3 -I.
Writes <project>/words.json, chunks.json, chunks.md.
"""
import json, os, re, subprocess, sys, difflib


def ts(s):
    s = s.strip().replace(',', '.'); p = [float(x) for x in s.split(':')]
    return p[0] * 3600 + p[1] * 60 + p[2] if len(p) == 3 else p[0] * 60 + p[1]


def parse(path):
    raw = open(path, encoding='utf-8-sig').read(); out = []
    if '-->' in raw:
        for blk in re.split(r'\n\s*\n', raw.strip()):
            ls = [l for l in blk.splitlines() if l.strip()]
            for i, l in enumerate(ls):
                if '-->' in l: out.append([ts(l.split('-->')[0]), ' '.join(ls[i + 1:]).strip()]); break
    else:
        for l in raw.splitlines():
            m = re.match(r'\s*(\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d+)?)\s+(.+)', l)
            if m: out.append([ts(m.group(1)), m.group(2).strip()])
    return out


def asr(video, proj, prompt, model):
    from faster_whisper import WhisperModel
    wav = os.path.join(proj, 'asr.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-vn', '-ac', '1', '-ar', '16000', wav], check=True)
    m = WhisperModel(model, device='cpu', compute_type='int8', cpu_threads=os.cpu_count() or 4)
    import wave, numpy as np   # pass samples, not a path: newer PyAV breaks faster-whisper's own decoder
    with wave.open(wav) as f: audio = np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(np.float32) / 32768
    segs, _ = m.transcribe(audio, language='th', word_timestamps=True, initial_prompt=prompt[:200], beam_size=5,
                          vad_filter=True, condition_on_previous_text=False)   # without these Whisper drops 10 s+ stretches of Thai
    return [[round(w.start, 3), round(w.end, 3), w.word] for s in segs for w in s.words]


def main():
    video, tr, proj = sys.argv[1:4]; model = sys.argv[4] if len(sys.argv) > 4 else 'large-v3-turbo'
    rows = parse(tr)
    if not rows: sys.exit('no timed lines in transcript')
    W = asr(video, proj, ''.join(t for _, t in rows)[:800], model)
    json.dump(W, open(os.path.join(proj, 'words.json'), 'w'), ensure_ascii=False)
    wc, wt = [], []
    for a, b, w in W:
        w = re.sub(r'\s', '', w)
        for i, ch in enumerate(w): wc.append(ch); wt.append(a + (b - a) * i / max(1, len(w)))
    tc, owner = [], []
    for k, (_, t) in enumerate(rows):
        for ch in re.sub(r'\s', '', t): tc.append(ch); owner.append(k)
    ct = [None] * len(tc)
    for a, b, n in difflib.SequenceMatcher(None, tc, wc, autojunk=False).get_matching_blocks():
        for i in range(n): ct[a + i] = wt[b + i]
    starts, flag = [], []
    for k, (stamp, t) in enumerate(rows):
        st = None
        for j, i in enumerate([i for i, o in enumerate(owner) if o == k]):
            if ct[i] is not None: st = ct[i] - j * .06; break
        if st is not None and not (stamp - .6 <= st <= stamp + 1.8): st = None   # a match far from the stamp is a false match
        starts.append(st); flag.append(st is None)
    for k in range(len(rows)):
        if starts[k] is None:
            prv = next((starts[j] for j in range(k - 1, -1, -1) if starts[j] is not None), None)
            nxt = next(((j, starts[j]) for j in range(k + 1, len(rows)) if starts[j] is not None), None)
            starts[k] = prv + (nxt[1] - prv) / (nxt[0] - k + 1) if prv is not None and nxt else rows[k][0] + .3
    for k in range(1, len(starts)):
        if starts[k] < starts[k - 1] + .12: starts[k] = starts[k - 1] + .12
    res = [[max(0, round(starts[k], 2)), round(starts[k + 1] - .02, 2) if k + 1 < len(rows) else round(starts[k] + 1.0, 2), rows[k][1]] for k in range(len(rows))]
    json.dump(res, open(os.path.join(proj, 'chunks.json'), 'w'), ensure_ascii=False, indent=0)
    with open(os.path.join(proj, 'chunks.md'), 'w') as f:
        f.write('| # | start | end | text | |\n|---|---|---|---|---|\n')
        for n, (a, b, t) in enumerate(res): f.write(f'| {n} | {a:.2f} | {b:.2f} | {t} | {"* interpolated" if flag[n] else ""} |\n')
    print(f'{len(res)} chunks, {sum(flag)} interpolated (*) → {proj}/chunks.json, chunks.md')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""A corrected transcript with times to the second (Friend 2026-11-06: "mm:ss text" per line) → words with the
fine times the engine needs, taken from the transcriber's words where the letters match.

usage: align_subs.py <asr words.json> <corrected.txt> <out words.json>

Each corrected line is cut into words (pythainlp, English kept whole). The letters of the corrected text are matched
in order to the letters of the transcriber's words (difflib); a matched letter takes the time it had there, the rest
are spread between their matched neighbours, never before their line's second and never backwards. A word starts at
its first letter and ends at its last letter (or where the next word starts). This stands in for step 4 of the web
app, where the customer corrects the words of the transcript.
"""
import difflib, json, re, sys


def letters(w):
    return [c for c in w.lower() if not c.isspace()]


def main(asr_path, txt_path, out_path):
    asr = json.load(open(asr_path))
    asr = asr['words'] if isinstance(asr, dict) else asr
    A, At0, At1 = [], [], []   # transcriber letters with start and end times
    for w in asr:
        cs = letters(w['w'])
        for k, c in enumerate(cs):
            A.append(c); At0.append(w['t0'] + (w['t1'] - w['t0']) * k / len(cs)); At1.append(w['t0'] + (w['t1'] - w['t0']) * (k + 1) / len(cs))
    from pythainlp.tokenize import word_tokenize
    lines = []
    for ln in open(txt_path, encoding='utf-8'):
        m = re.match(r'\s*(\d+):(\d+)\s+(.*\S)', ln)
        if m: lines.append((int(m.group(1)) * 60 + int(m.group(2)), m.group(3)))
    toks, B, owner = [], [], []   # corrected words, letters, and which word each letter belongs to
    for li, (sec, text) in enumerate(lines):
        for t in word_tokenize(text, engine='newmm', keep_whitespace=False):
            t = t.strip()
            if not t: continue
            toks.append({'w': t, 'line': li, 'sec': sec})
            for c in letters(t): B.append(c); owner.append(len(toks) - 1)
    t0 = [None] * len(B); t1 = [None] * len(B)
    sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
    matched = 0
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): t0[b + k], t1[b + k] = At0[a + k], At1[a + k]
        matched += n
    known = [i for i, x in enumerate(t0) if x is not None]
    for i in range(len(B)):   # spread the unmatched letters between matched neighbours
        if t0[i] is not None: continue
        p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
        if p is None and q is None: t0[i] = t1[i] = toks[owner[i]]['sec']; continue
        if p is None: t0[i] = t1[i] = t0[q]; continue
        if q is None: t0[i] = t1[i] = t1[p]; continue
        f = (i - p) / (q - p)
        t0[i] = t1[p] + (t0[q] - t1[p]) * f; t1[i] = t0[i]
    last = 0.0
    for i in range(len(B)):   # never before the line's second, never backwards
        t0[i] = max(t0[i], toks[owner[i]]['sec'], last); t1[i] = max(t1[i], t0[i]); last = t0[i]
    words = []
    for j, tk in enumerate(toks):
        idx = [i for i, o in enumerate(owner) if o == j]
        words.append({'w': tk['w'], 't0': round(t0[idx[0]], 3), 't1': round(t1[idx[-1]], 3)})
    for j in range(len(words) - 1):   # a word ends at its last letter, or where the next one starts
        nxt = words[j + 1]['t0']
        if words[j]['t1'] > nxt: words[j]['t1'] = nxt
        if words[j]['t1'] <= words[j]['t0']: words[j]['t1'] = round(min(nxt, words[j]['t0'] + 0.15), 3)
    if words and words[-1]['t1'] <= words[-1]['t0']: words[-1]['t1'] = round(words[-1]['t0'] + 0.3, 3)
    json.dump({'words': words}, open(out_path, 'w'), ensure_ascii=False, indent=1)
    print(f'{len(words)} words, {matched}/{len(B)} letters matched to the transcriber ({matched / len(B):.0%})')
    for li, (sec, text) in enumerate(lines):   # each line's first word time against the second Friend wrote
        first = next(w for w, tk in zip(words, toks) if tk['line'] == li)
        flag = '' if -0.1 <= first['t0'] - sec < 1.6 else '  <-- check'
        print(f'{sec:3d}s  {first["t0"]:6.2f}  {text}{flag}')


if __name__ == '__main__':
    if len(sys.argv) != 4: sys.exit(__doc__)
    main(*sys.argv[1:])

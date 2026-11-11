#!/usr/bin/env python3
"""Put the right words on Typhoon's times: the words come from a typed or corrected script, the times from the audio.

usage: align.py <typhoon_words.json> <script.txt> <words.json>
  typhoon_words.json  what asr.py wrote (its "pieces": Typhoon's sub-word pieces with the moment each was heard)
  script.txt          the words to show, one phrase per line; a line may start with a time ("00:12 ข้อความ"),
                      which is only used for the report (how far the real time is from the typed one)
writes {"words": [{"w", "t0", "t1"}], "lines": [{"text", "typed", "t0"}], "matched", "source": "align"}
which captions.py takes as its words.json.

Why: Friend's typed script is the correct subtitle text, but its times are whole seconds rounded down, so the
subtitles came up 0.3 to 0.6 s before the mouth (Friend 2026-11-11: "subtitles บางจังหวะเร็วกว่าปากไปนิดนึง").
Typhoon hears the right moments but gets some words wrong (English names most of all). The web needs the same step:
the customer corrects the words (step 4) and the times must stay.

How: the script is cut into words (PyThaiNLP newmm, the same dictionary as asr.py); the letters of both texts are
lined up with spaces removed (difflib); each script letter Typhoon also wrote takes that letter's time. Letters
Typhoon wrote differently (Facebook → เฟซบุ๊ก) get times in between their neighbours: spread evenly when the gap
fits them, otherwise kept next to the word they belong to (a word already started stays after it, a new word goes
just before the next letter heard), so a misheard word never stretches over a pause.
"""
import difflib, json, os, re, sys, unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from asr import PAUSE, clean, letter_times, split_thai, thai, word_ends

LETTER = 0.08      # a typical letter of Thai speech (s), for letters Typhoon did not write
SLOW = 0.16        # letters spread wider than this each mean a pause sits in the gap
TIME = re.compile(r'^\s*(?:(\d+):)?(\d{1,2}):(\d{2}(?:\.\d+)?)\s+')


def read_script(text):
    """'00:12 ข้อความ' lines → [(typed seconds or None, text)], blank lines dropped."""
    out = []
    for ln in text.splitlines():
        if not ln.strip(): continue
        m = TIME.match(ln)
        typed = None
        if m:
            typed = int(m.group(1) or 0) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
            ln = ln[m.end():]
        out.append((typed, clean(ln)))
    return out


def cut(line):
    """One script line → its words (spaces cut first, then the Thai dictionary inside each group)."""
    return [w for g in line.split() for w in (split_thai(g) if thai(g) else [g])]


def key(c): return unicodedata.normalize('NFC', c).lower()


def align(pieces, script):
    """pieces: Typhoon's [{"w","t0","t1"}] · script: [(typed, text)] → (words, lines, share of letters matched)."""
    s, ct = letter_times(pieces)
    heard = [(key(c), t) for c, t in zip(s, ct) if not c.isspace()]
    words, owner = [], []                      # script words, and for each script letter the word it belongs to
    for li, (_, text) in enumerate(script):
        for w in cut(text):
            words.append({'w': w, 'line': li})
            owner += [len(words) - 1] * len(w)
    A = ''.join(w['w'] for w in words)
    if not A: return [], [], 0.0
    tm = [None] * len(A)
    if heard:
        B = ''.join(c for c, _ in heard)
        sm = difflib.SequenceMatcher(None, ''.join(key(c) for c in A), B, autojunk=False)
        for a, b, n in sm.get_matching_blocks():
            if n < 2: continue                 # a lone letter in common is chance, not the same word
            for k in range(n): tm[a + k] = heard[b + k][1]
    got = [i for i, t in enumerate(tm) if t is not None]
    share = len(got) / len(A)
    end = max([t for _, t in heard] + [0.0])
    if not got:                                # nothing heard in common: spread the script evenly over the audio
        tm = [end * i / len(A) for i in range(len(A))]
    i = 0
    while i < len(A):                          # fill each run of letters Typhoon did not write
        if tm[i] is not None: i += 1; continue
        j = i
        while j < len(A) and tm[j] is None: j += 1
        n, ta, tb = j - i, tm[i - 1] if i else None, tm[j] if j < len(A) else None
        if ta is None: ta = max(0.0, tb - LETTER * (n + 1))
        if tb is None: tb = ta + LETTER * (n + 1)
        if (tb - ta) / (n + 1) <= SLOW:        # the gap fits the letters: spread them evenly
            for k in range(n): tm[i + k] = ta + (tb - ta) * (k + 1) / (n + 1)
        else:                                  # a pause in the gap: keep each letter by its own word
            on = owner[i - 1] if i else -1     # the word heard just before the run, if the run carries it on
            m = 0
            while m < n and owner[i + m] == on: m += 1
            for k in range(m): tm[i + k] = ta + LETTER * (k + 1)
            for k in range(m, n): tm[i + k] = tb - LETTER * (n - k)
        i = j
    out, a = [], 0
    for w in words:
        b = a + len(w['w'])
        t0 = max(tm[a], out[-1]['t0'] if out else 0.0)
        out.append({'w': w['w'], 't0': round(t0, 2), '_end': max(tm[b - 1], t0), 'line': w['line']}); a = b
    lines = []
    for li, (typed, text) in enumerate(script):
        first = next((w for w in out if w['line'] == li), None)
        lines.append({'text': text, 'typed': typed, 't0': first['t0'] if first else None})
    for w in out: w.pop('line')
    return word_ends(out), lines, round(share, 3)


def report(lines, share):
    d = [(l['t0'] - l['typed'], l) for l in lines if l['typed'] is not None and l['t0'] is not None]
    msg = [f'{share:.0%} of the script letters heard by Typhoon']
    if d:
        late = sorted(x for x, _ in d)
        msg.append(f'real start minus typed time: median {late[len(late) // 2]:+.2f} s, '
                   f'from {late[0]:+.2f} to {late[-1]:+.2f} s over {len(d)} lines')
    return '\n'.join(msg)


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) != 3: sys.exit(__doc__)
    ty = json.load(open(a[0]))
    script = read_script(open(a[1], encoding='utf-8').read())
    words, lines, share = align(ty.get('pieces') or ty['words'], script)
    with open(a[2], 'w') as f:
        json.dump({'words': words, 'lines': lines, 'matched': share, 'source': 'align'}, f, ensure_ascii=False, indent=1)
    print(f'{len(words)} words → {a[2]}\n' + report(lines, share))

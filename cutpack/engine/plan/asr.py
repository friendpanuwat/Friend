#!/usr/bin/env python3
"""Transcription step (DECISIONS 2, step 2): Typhoon ASR Realtime on our own machine → words with their times.

usage: asr.py <audio or video> <words.json> [--threads 2]
writes {"words": [{"w", "t0", "t1"}], "text", "model", "audio_s", "seconds"}

Friend agreed (2026-11-04) to Typhoon ASR Realtime: most accurate on Thai words and fastest of the three tested
(asr-test/README.md). The model is called through NeMo directly, as asr-test/bench.py does, because the typhoon-asr
package only spreads word times evenly over the clip, which is no use for timing subtitles. Its timestamps are
sub-word pieces, fine enough for the key word of each chunk.
Needs: pip install typhoon-asr soundfile (pulls NeMo and torch, several GB; about 1 GB of memory while running).
The model downloads from Hugging Face on first use. Before selling: read OpenTyphoon's terms for commercial use.
"""
import json, os, subprocess, sys, tempfile, time, unicodedata

MODEL = 'typhoon-ai/typhoon-asr-realtime'
_model = None
DEP = 'ะัาำิีึืฺุู็่้๊๋์ํ๎'   # Thai vowels and marks written after their consonant: never start a word
LEAD = 'เแโใไ'               # vowels written before their consonant: never end a word
PAUSE = 0.6                  # pieces carry the moment they were heard, not a span: a jump this big is a pause


def thai(s): return any('฀' <= c <= '๿' for c in s)


def split_thai(group):
    """A run of Thai with no space → words, with a Thai dictionary (PyThaiNLP newmm, Apache-2.0) when installed."""
    if not thai(group): return [group]
    try:
        from pythainlp.tokenize import word_tokenize
        toks = [t for t in word_tokenize(group, engine='newmm', keep_whitespace=False) if t]
        if ''.join(toks) == group: return toks
    except ImportError:
        pass
    return [group]


def letter_times(pieces):
    """Typhoon's pieces → (all their letters as one string, the time of each letter).
    Each letter gets a time spread between its piece and the next one (at most PAUSE / 2 after its piece)."""
    pieces = [p for p in pieces if p['w']]
    s, ct = ''.join(p['w'] for p in pieces), []
    for i, p in enumerate(pieces):
        nxt = pieces[i + 1]['t0'] if i + 1 < len(pieces) else p['t1']
        span = min(max(nxt - p['t0'], 0.0), PAUSE / 2) or max(p['t1'] - p['t0'], 0.05)
        ct += [p['t0'] + span * k / len(p['w']) for k in range(len(p['w']))]
    return s, ct


def word_ends(words):
    """Each word lasts until the next word starts, unless a pause follows (then 0.25 s after its last letter).
    Takes words with 'w', 't0' and '_end' (time of the last letter) and replaces '_end' with 't1'."""
    for i, w in enumerate(words):
        end = w.pop('_end')
        nxt = words[i + 1]['t0'] if i + 1 < len(words) else None
        w['t1'] = round(nxt if nxt is not None and nxt - end < PAUSE / 2 else end + 0.25, 2)
    return words


def to_words(pieces, text):
    """Typhoon's sub-word pieces → whole words with times, for subtitles.

    The pieces can split a syllable (ไอ|เด|ีย) and English comes letter by letter (M|a|r|k|s), so the pieces are
    joined and cut again: at the spaces of the full text, at pauses, and by a Thai dictionary inside each group.
    Each letter gets a time spread between its piece and the next one; a word lasts until the next word starts,
    unless a pause follows."""
    pieces = [p for p in pieces if p['w']]
    if not pieces: return []
    s, ct = letter_times(pieces)
    spaced = text.split()
    cuts = set()   # letter positions where a new word must start
    if ''.join(spaced) == s:
        k = 0
        for g in spaced: cuts.add(k); k += len(g)
    else:
        k = 0
        for p in pieces:   # no usable text: piece edges are the only hint, kept where a piece can start a word
            if k and p['w'][0] not in DEP and s[k - 1] not in LEAD: cuts.add(k)
            k += len(p['w'])
    cuts |= {i for i in range(1, len(s)) if ct[i] - ct[i - 1] >= PAUSE}
    cuts.add(len(s))
    spans, a = [], 0
    for b in sorted(cuts - {0}):
        for tok in split_thai(s[a:b]):
            spans.append((a, a + len(tok))); a += len(tok)
    words = []
    for a, b in spans:
        w = s[a:b]
        if words and not any(ch.isalnum() for ch in w):   # punctuation alone joins the word before it
            words[-1]['w'] += w; words[-1]['_end'] = ct[b - 1]; continue
        words.append({'w': w, 't0': round(ct[a], 2), '_end': ct[b - 1]})
    return word_ends(words)


def audio16k(path):
    """Mono 16 kHz float32 samples via ffmpeg, level normalised the way the typhoon-asr package does it."""
    import numpy as np
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    y = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    return y / (np.abs(y).max() + 1e-8) if len(y) else y


def clean(s):
    """NFC, and ํ + า written apart joined into ำ (Typhoon writes SARA AM in two pieces)."""
    return unicodedata.normalize('NFC', s or '').replace('ํา', 'ำ').strip()


def load(threads=2):
    global _model
    if _model is None:
        import torch
        torch.set_num_threads(threads)
        import nemo.collections.asr as nemo_asr
        _model = nemo_asr.models.ASRModel.from_pretrained(MODEL, map_location='cpu'); _model.eval()
    return _model


def transcribe(path, threads=2):
    import soundfile as sf
    t = time.time()
    y = audio16k(path)
    if len(y) < 1600: return {'words': [], 'text': '', 'model': MODEL, 'audio_s': len(y) / 16000, 'seconds': 0.0}
    model = load(threads)
    with tempfile.NamedTemporaryFile(suffix='.wav') as f:
        sf.write(f.name, y, 16000)
        try: out = model.transcribe(audio=[f.name], return_hypotheses=True, timestamps=True, verbose=False)
        except TypeError: out = model.transcribe(audio=[f.name], return_hypotheses=True)
    if isinstance(out, tuple): out = out[0]
    hyp = out[0]
    ts = getattr(hyp, 'timestamp', None) or {}
    toks = ts.get('char') or ts.get('word') or []   # 'char' = each sub-word piece with the moment it was heard
    pieces = []
    for w in toks:
        text = ''.join(w['char']) if isinstance(w.get('char'), list) else (w.get('char') or w.get('word'))
        text = clean(text)
        if text: pieces.append({'w': text, 't0': round(float(w.get('start', 0)), 2), 't1': round(float(w.get('end', 0)), 2)})
    text = clean(hyp.text if hasattr(hyp, 'text') else str(hyp))
    return {'words': to_words(pieces, text), 'pieces': pieces, 'text': text, 'model': MODEL,
            'audio_s': round(len(y) / 16000, 2), 'seconds': round(time.time() - t, 1)}


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2: sys.exit(__doc__)
    res = transcribe(a[0], int(a[a.index('--threads') + 1]) if '--threads' in a else 2)
    with open(a[1], 'w') as f: json.dump(res, f, ensure_ascii=False, indent=1)
    print(f"{len(res['words'])} words in {res['seconds']} s → {a[1]}\n{res['text']}")

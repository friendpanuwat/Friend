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
    toks = ts.get('char') or ts.get('word') or []   # 'char' = each sub-word piece with its time
    words = []
    for w in toks:
        text = ''.join(w['char']) if isinstance(w.get('char'), list) else (w.get('char') or w.get('word'))
        text = clean(text)
        if text: words.append({'w': text, 't0': round(float(w.get('start', 0)), 2), 't1': round(float(w.get('end', 0)), 2)})
    return {'words': words, 'text': clean(hyp.text if hasattr(hyp, 'text') else str(hyp)), 'model': MODEL,
            'audio_s': round(len(y) / 16000, 2), 'seconds': round(time.time() - t, 1)}


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2: sys.exit(__doc__)
    res = transcribe(a[0], int(a[a.index('--threads') + 1]) if '--threads' in a else 2)
    with open(a[1], 'w') as f: json.dump(res, f, ensure_ascii=False, indent=1)
    print(f"{len(res['words'])} words in {res['seconds']} s → {a[1]}\n{res['text']}")

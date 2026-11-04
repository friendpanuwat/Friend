#!/usr/bin/env python3
"""Compare Thai speech-to-text options on the same clips (DECISIONS 9, item 4).

usage: bench.py <clips_dir> <refs.json|-> <out.json> [models…] [--threads 2]
  refs.json = [{"file": "x.wav", "text": "reference transcript"}]  ("-" = no reference: speed and output only)
  models    = whisper-turbo · typhoon-whisper-turbo · typhoon-realtime  (default: all three)

whisper-turbo is OpenAI's whisper-large-v3-turbo, the model Groq serves, run here with faster-whisper — so its
accuracy stands for Groq's (Groq only adds speed and a price). The Typhoon models are Thai models run on our own
machine (no account, no API fee). --threads 2 copies the render server (Hetzner CX23, 2 vCPU).
Score: CER = character edits / reference characters, after removing spaces and punctuation (Thai has no spaces, so
character errors are the fair count). Lower is better.
"""
import json, os, re, sys, time, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
MODELS = os.environ.get('ASR_MODELS', os.path.join(HERE, 'models'))   # converted models (large, not in git)


def norm(s):
    s = unicodedata.normalize('NFC', s).lower()
    return ''.join(ch for ch in s if unicodedata.category(ch)[0] in 'LMN')   # letters, marks, digits only


def cer(ref, hyp):
    r, h = norm(ref), norm(hyp)
    prev = list(range(len(h) + 1))
    for i, a in enumerate(r, 1):
        cur = [i] + [0] * len(h)
        for j, b in enumerate(h, 1):
            cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a != b))
        prev = cur
    return prev[-1], max(1, len(r))


def audio16k(path):
    """Mono 16 kHz float32 samples via ffmpeg (faster-whisper's own decoder does not work with the installed PyAV)."""
    import numpy as np, subprocess
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


def whisper(model_dir, threads):
    from faster_whisper import WhisperModel
    m = WhisperModel(model_dir, device='cpu', compute_type='int8', cpu_threads=threads)
    def run(path):
        segs, _ = m.transcribe(audio16k(path), language='th', beam_size=5, word_timestamps=True, vad_filter=False)
        segs = list(segs)
        words = [(w.word, round(w.start, 2), round(w.end, 2)) for s in segs for w in (s.words or [])]
        return ''.join(s.text for s in segs).strip(), words
    return run


def typhoon_realtime(threads):
    import torch
    torch.set_num_threads(threads)
    from typhoon_asr import transcribe
    def run(path):
        r = transcribe(path, model_name='typhoon-ai/typhoon-asr-realtime', with_timestamps=True, device='cpu')
        words = [(w.get('word'), w.get('start'), w.get('end')) for w in (r.get('timestamps') or [])] if isinstance(r, dict) else []
        return (r.get('text') if isinstance(r, dict) else str(r)).strip(), words
    return run


def load(name, threads):
    if name == 'whisper-turbo': return whisper('large-v3-turbo', threads)
    if name == 'typhoon-whisper-turbo': return whisper(os.path.join(MODELS, 'typhoon-whisper-turbo-ct2'), threads)
    if name == 'typhoon-realtime': return typhoon_realtime(threads)
    raise SystemExit(f'unknown model {name}')


if __name__ == '__main__':
    a = sys.argv[1:]
    threads = int(a[a.index('--threads') + 1]) if '--threads' in a else 2
    a = [x for i, x in enumerate(a) if x != '--threads' and (i == 0 or a[i - 1] != '--threads')]
    clips, refs_path, out = a[0], a[1], a[2]
    names = a[3:] or ['whisper-turbo', 'typhoon-whisper-turbo', 'typhoon-realtime']
    refs = json.load(open(refs_path)) if refs_path != '-' else [{'file': f} for f in sorted(os.listdir(clips))]
    result = json.load(open(out)) if os.path.exists(out) else {}
    for name in names:
        t0 = time.time(); run = load(name, threads); t_load = time.time() - t0
        rows, edits, chars, t_run = [], 0, 0, 0.0
        for r in refs:
            s = time.time(); text, words = run(os.path.join(clips, r['file'])); t_run += time.time() - s
            row = {'file': r['file'], 'text': text, 'words': words[:60]}
            if 'text' in r:
                e, n = cer(r['text'], text); edits += e; chars += n; row['cer'] = round(e / n, 4)
            rows.append(row)
        result[name] = {'threads': threads, 'load_s': round(t_load, 1), 'run_s': round(t_run, 1),
                        'cer': round(edits / chars, 4) if chars else None, 'word_times': any(r['words'] for r in rows), 'clips': rows}
        json.dump(result, open(out, 'w'), ensure_ascii=False, indent=1)
        print(f"{name:24s} CER {result[name]['cer']}  run {t_run:.0f} s  load {t_load:.0f} s  word times {result[name]['word_times']}", flush=True)

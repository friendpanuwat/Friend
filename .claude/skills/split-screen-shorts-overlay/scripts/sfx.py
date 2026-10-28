"""Synthesize a small, soft SFX library (pure python) and mix an SFX track from cues.json.
usage: sfx.py cues.json out.wav <duration_s>"""
import math, random, wave, array, json, sys

SR = 48000
random.seed(7)


def lowpass(sig, fc_fn):
    y, out = 0.0, []
    for i, x in enumerate(sig):
        fc = fc_fn(i)
        a = 1 - math.exp(-2 * math.pi * fc / SR)
        y += a * (x - y)
        out.append(y)
    return out


def highpass(sig, fc):
    a = math.exp(-2 * math.pi * fc / SR)
    y, xp, out = 0.0, 0.0, []
    for x in sig:
        y = a * (y + x - xp)
        xp = x
        out.append(y)
    return out


def norm(sig, peak=0.9):
    m = max(abs(s) for s in sig) or 1
    return [s * peak / m for s in sig]


def noise(n):
    return [random.uniform(-1, 1) for _ in range(n)]


def whoosh(dur=0.5, lo=300, hi=4500):
    n = int(SR * dur)
    nz = noise(n)
    # band sweep: cutoff rises then falls, amplitude bell
    fc = lambda i: lo + (hi - lo) * math.sin(math.pi * i / n) ** 1.5
    s = lowpass(nz, fc)
    s = highpass(s, 150)
    e = [math.sin(math.pi * i / n) ** 2.2 for i in range(n)]
    return norm([a * b for a, b in zip(s, e)])


def pop(f0=900, f1=280, dur=0.09):
    n = int(SR * dur)
    out, ph = [], 0.0
    for i in range(n):
        p = i / n
        f = f1 + (f0 - f1) * (1 - p) ** 3
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * (1 - p) ** 2.5)
    click = [random.uniform(-1, 1) * (1 - i / 120) for i in range(120)]
    for i in range(120):
        out[i] += 0.25 * click[i]
    return norm(out)


def tick(f=2200, dur=0.035):
    n = int(SR * dur)
    return norm([math.sin(2 * math.pi * f * i / SR) * (1 - i / n) ** 4 for i in range(n)])


def sub(dur=1.6):
    n = int(SR * dur)
    out, ph = [], 0.0
    for i in range(n):
        p = i / n
        f = 34 + 30 * (1 - p) ** 4
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * (1 - p) ** 1.6 * min(1, i / 200))
    click = lowpass(noise(2400), lambda i: 900)
    for i in range(2400):
        out[i] += 0.5 * click[i] * (1 - i / 2400)
    return norm([math.tanh(1.5 * s) for s in out])


def swell(dur=0.7):
    n = int(SR * dur)
    s = lowpass(noise(n), lambda i: 300 + 5000 * (i / n) ** 2)
    s = highpass(s, 250)
    return norm([x * (i / n) ** 3 for i, x in enumerate(s)])


def softswish(dur=0.32):
    n = int(SR * dur)
    s = lowpass(noise(n), lambda i: 600 + 3500 * math.sin(math.pi * i / n))
    s = highpass(s, 300)
    return norm([x * math.sin(math.pi * i / n) ** 3 for i, x in enumerate(s)])

LIB = {   # few and quiet (references/core.md): soft air for scene entrances, a low swell under a flash, a light tick / pop
    'softswish': softswish,
    'whoosh': lambda: whoosh(0.45, 250, 3000),
    'swell': swell,
    'sub': sub,
    'pop': lambda: pop(650, 260, 0.09),
    'tick': tick,
}


def write_wav(path, sig):
    a = array.array('h', [int(max(-1, min(1, s)) * 32767) for s in sig])
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(a.tobytes())


def pitch(sig, r):
    """resample-based pitch shift (changes duration)"""
    n = int(len(sig) / r)
    return [sig[min(len(sig) - 1, int(i * r))] for i in range(n)]


if __name__ == '__main__':
    cues = json.load(open(sys.argv[1]))
    total = float(sys.argv[3])
    cache = {}
    track = [0.0] * int(SR * total)
    for c in cues:
        name, t, gain_db = c['s'], c['t'], c.get('db', -6)
        if name not in cache:
            cache[name] = LIB[name]()
        sig = cache[name]
        if c.get('pitch'):
            sig = pitch(sig, c['pitch'])
        g = 10 ** (gain_db / 20)
        st = int(t * SR)
        for i, s in enumerate(sig):
            if 0 <= st + i < len(track):
                track[st + i] += s * g
    write_wav(sys.argv[2], track)
    print('sfx cues', len(cues))

"""Synthesize a small SFX library (pure python) and mix an SFX track from cues.json."""
import math, random, wave, array, json, sys

SR = 48000
random.seed(7)


def env_ad(n, a, d_pow=2.0):
    """attack fraction a, then power decay"""
    out = []
    na = max(1, int(n * a))
    for i in range(n):
        if i < na:
            out.append(i / na)
        else:
            out.append((1 - (i - na) / max(1, n - na)) ** d_pow)
    return out


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


def swipe(dur=0.22):
    return whoosh(dur, 800, 7000)


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


def impact(dur=0.9):
    n = int(SR * dur)
    out, ph = [], 0.0
    nz = lowpass(noise(n), lambda i: 2500 * (1 - i / n) ** 4 + 120)
    for i in range(n):
        p = i / n
        f = 42 + 95 * (1 - p) ** 6
        ph += 2 * math.pi * f / SR
        body = math.sin(ph) * (1 - p) ** 2.2
        out.append(body + 0.9 * nz[i] * (1 - p) ** 6)
    # soft-clip for weight
    return norm([math.tanh(2.2 * s) for s in out])


def thud(dur=0.28):
    n = int(SR * dur)
    out, ph = [], 0.0
    nz = lowpass(noise(n), lambda i: 1800)
    for i in range(n):
        p = i / n
        f = 70 + 140 * (1 - p) ** 5
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * (1 - p) ** 3 + 0.6 * nz[i] * (1 - p) ** 12)
    return norm([math.tanh(1.8 * s) for s in out])


def ding(f=1318.5, dur=1.3):
    n = int(SR * dur)
    parts = [(1, 1.0, 3.0), (2.76, 0.35, 5.0), (5.4, 0.15, 8.0), (2.0, 0.25, 4.0)]
    out = []
    for i in range(n):
        t = i / SR
        s = sum(a * math.sin(2 * math.pi * f * r * t) * math.exp(-k * t) for r, a, k in parts)
        out.append(s * min(1, i / 60))
    return norm(out)


def tick(f=2200, dur=0.035):
    n = int(SR * dur)
    return norm([math.sin(2 * math.pi * f * i / SR) * (1 - i / n) ** 4 for i in range(n)])


def riser(dur=1.2):
    n = int(SR * dur)
    nz = noise(n)
    s = lowpass(nz, lambda i: 200 + 7000 * (i / n) ** 2)
    s = highpass(s, 200)
    out, ph = [], 0.0
    for i in range(n):
        p = i / n
        ph += 2 * math.pi * (180 + 900 * p ** 2) / SR
        e = p ** 2.2 * (1 if p < 0.97 else (1 - p) / 0.03)
        out.append((0.8 * s[i] * 3 + 0.25 * math.sin(ph)) * e)
    return norm(out)


def womp(dur=1.1):
    """descending 'fail' two-note womp (saw-ish, filtered)"""
    n = int(SR * dur)
    out, ph = [], 0.0
    half = n // 2
    for i in range(n):
        if i < half:
            p = i / half
            f = 330 - 40 * p
            e = min(1, i / 400) * (1 - p) ** 0.6
        else:
            p = (i - half) / (n - half)
            f = 280 - 150 * p ** 1.5
            e = min(1, (i - half) / 400) * (1 - p) ** 1.2
        f *= 1 + 0.02 * math.sin(2 * math.pi * 6 * i / SR)
        ph += 2 * math.pi * f / SR
        saw = sum(math.sin(k * ph) / k for k in range(1, 7))
        out.append(saw * e)
    out = lowpass(out, lambda i: 1600)
    return norm(out)


def boing(dur=0.5):
    n = int(SR * dur)
    out, ph = [], 0.0
    for i in range(n):
        p = i / n
        f = 180 + 260 * p + 60 * math.sin(2 * math.pi * 14 * p)
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * (1 - p) ** 1.5 * min(1, i / 200))
    return norm(out)


def sparkle(dur=0.9, k=9):
    n = int(SR * dur)
    out = [0.0] * n
    for j in range(k):
        st = int(n * j / (k + 2) + random.uniform(0, 0.03) * SR)
        f = random.choice([2637, 3136, 3520, 3951, 4186, 4699])
        L = int(SR * 0.25)
        for i in range(L):
            if st + i < n:
                out[st + i] += math.sin(2 * math.pi * f * i / SR) * math.exp(-i / SR * 14) * (0.6 + 0.4 * random.random())
    return norm(out)


def glitch(dur=0.35):
    n = int(SR * dur)
    out, i = [], 0
    while i < n:
        L = random.randint(300, 2400)
        f = random.choice([120, 240, 480, 960, 1900])
        a = random.choice([0, 0.4, 1, 0.8])
        for j in range(L):
            out.append(a * (1 if math.sin(2 * math.pi * f * j / SR) > 0 else -1))
        i += L
    out = out[:n]
    return norm(lowpass(out, lambda i: 5000), 0.7)


def heart_pop():
    a, b = pop(700, 350, 0.08), pop(1100, 500, 0.1)
    out = a + [0.0] * int(SR * 0.06) + b
    return norm(out)


def stamp():
    t = thud(0.3)
    nz = highpass(noise(int(SR * 0.06)), 1500)
    for i in range(len(nz)):
        t[i] += 0.5 * nz[i] * (1 - i / len(nz))
    return norm(t)



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

LIB = {
    'sub': sub,
    'swell': swell,
    'softswish': softswish,
    'whoosh': lambda: whoosh(0.5),
    'whoosh_long': lambda: whoosh(0.8, 200, 3500),
    'swipe': swipe,
    'pop': lambda: pop(),
    'pop_hi': lambda: pop(1400, 520, 0.08),
    'pop_lo': lambda: pop(650, 200, 0.1),
    'impact': impact,
    'thud': thud,
    'ding': ding,
    'tick': tick,
    'riser': riser,
    'womp': womp,
    'boing': boing,
    'sparkle': sparkle,
    'glitch': glitch,
    'heart': heart_pop,
    'stamp': stamp,
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
    for k, v in cache.items():
        write_wav(f'lib_{k}.wav', v)
    write_wav(sys.argv[2], track)
    print('sfx cues', len(cues))

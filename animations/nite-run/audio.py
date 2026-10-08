"""Original score + sound design for NITE RUN (30 s, 96 BPM). Everything is synthesized here.
usage: python3 audio.py out/mix.wav
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 48000
DUR = 30.0
N = int(SR * DUR)
BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4
rng = np.random.default_rng(7)

def t_(d): return np.arange(int(d * SR)) / SR
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d)
def note(m): return 440 * 2 ** ((m - 69) / 12)

music = np.zeros((N, 2)); sfx = np.zeros((N, 2))
def add(buf, x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N: return
    x = x[: N - i]
    l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    if x.ndim == 1:
        buf[i:i + len(x), 0] += x * gain * l * 1.414; buf[i:i + len(x), 1] += x * gain * r * 1.414
    else:
        buf[i:i + len(x)] += x * gain

# ---------------- instruments ----------------
def kick():
    t = t_(0.45); f = 45 + 80 * np.exp(-t / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t / 0.22) + 0.25 * np.exp(-t / 0.004) * rng.standard_normal(len(t))
    return np.tanh(x * 1.6) * 0.9
def snare():
    t = t_(0.35)
    n = bp(rng.standard_normal(len(t)), 1200, 7000) * np.exp(-t / 0.09)
    b = np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.05)
    return np.tanh((n * 0.9 + b * 0.6) * 1.4) * 0.6
def hat(open_=False):
    t = t_(0.25 if open_ else 0.06)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t / (0.08 if open_ else 0.018)) * 0.35
def rhodes(m, d, vel=1.0):
    t = t_(d + 0.8); f = note(m)
    x = (np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / 0.3))
         + 0.3 * np.sin(2 * np.pi * f * 2.001 * t) * np.exp(-t / 0.5))
    e = env_ad(len(t), 0.01, 1.4) * np.where(t < d, 1, np.exp(-(t - d) / 0.25))
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.5 * t)
    return x * e * trem * 0.16 * vel
def bass(m, d):
    t = t_(d + 0.1); f = note(m)
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) + 0.1 * np.sign(np.sin(2 * np.pi * f * t))
    e = env_ad(len(t), 0.008, 0.9) * np.where(t < d, 1, np.exp(-(t - d) / 0.04))
    return lp(x * e, 600) * 0.5
def pluck(m, d=0.4):
    t = t_(d); f = note(m)
    x = sum(np.sin(2 * np.pi * f * k * t) / k * np.exp(-t * k * 3) for k in range(1, 6))
    return x * env_ad(len(t), 0.003, 0.25) * 0.22
def pad(ms, d):
    t = t_(d); x = np.zeros(len(t))
    for m in ms:
        for det in (-0.08, 0.08):
            f = note(m) * 2 ** (det / 12)
            x += np.sign(np.sin(2 * np.pi * f * t + rng.random() * 6)) * 0.5 + np.sin(2 * np.pi * f * t)
    x = lp(x, 900)
    e = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.6)
    return x * e * 0.03

# ---------------- score ----------------
# Am9 | Fmaj9 | Cmaj9 | Em7   (looped)
CH = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 67], [48, 52, 55, 59, 62], [52, 55, 59, 62, 64]]
ROOT = [45, 41, 36, 40]
MEL = [  # (beat offset in bar, midi, len beats)
    [(0.5, 76, 0.5), (1.5, 74, 0.5), (2.0, 72, 1.0), (3.25, 69, 0.5)],
    [(0.5, 72, 0.5), (1.0, 69, 0.5), (2.5, 67, 0.75)],
    [(0.0, 71, 0.5), (0.75, 72, 0.5), (1.5, 74, 1.0), (3.0, 76, 0.5)],
    [(0.5, 74, 0.5), (1.5, 71, 0.5), (2.0, 67, 1.5)],
]
DRUMS_ON = (1.5 * BAR, 11 * BAR)  # drop at 3.75 s, out at 27.5 s
swing = BEAT / 2 * 0.58
for bar in range(12):
    t0 = bar * BAR; c = bar % 4
    if bar == 11:  # title: one long chord
        for m in CH[0] + [69 + 12]: add(music, rhodes(m, 2.0, 1.1), t0, 1.0, (m % 5 - 2) * 0.15)
        add(music, bass(33, 2.2), t0, 1.0)
        continue
    for m in CH[c]:
        add(music, rhodes(m, BAR * 0.9), t0, 1.0, (m % 5 - 2) * 0.15)
        add(music, rhodes(m, BEAT * 0.4, 0.6), t0 + BEAT * 2.5, 1.0, (m % 5 - 2) * 0.15)
    add(music, pad(CH[c][:3], BAR), t0, 1.0)
    if t0 >= DRUMS_ON[0]:
        add(music, bass(ROOT[c], BEAT * 1.4), t0); add(music, bass(ROOT[c], BEAT * 0.4), t0 + BEAT * 1.75)
        add(music, bass(ROOT[c] + 7, BEAT * 0.9), t0 + BEAT * 2.5); add(music, bass(ROOT[c] + 12, BEAT * 0.4), t0 + BEAT * 3.5)
        if bar >= 3:
            for off, m, ln in MEL[c]: add(music, pluck(m, ln * BEAT + 0.2), t0 + off * BEAT, 1.0, 0.25)
        for b in range(4):
            bt = t0 + b * BEAT
            if b in (0,) or (b == 2 and bar % 2 == 0): add(music, kick(), bt, 1.0)
            if b == 1 and bar % 2 == 1: add(music, kick(), bt + swing, 0.7)
            if b == 2: add(music, kick(), bt + swing, 0.65)
            if b in (1, 3): add(music, snare(), bt + 0.012, 0.9)
            add(music, hat(), bt, 0.8, -0.2); add(music, hat(b == 3 and bar % 2), bt + swing, 0.55, -0.2)
# lowpass the intro (as if heard from inside the store), open on the drop; dip during the LCD insert
i0 = int(DRUMS_ON[0] * SR)
music[:i0] = np.stack([lp(music[:i0, k], 700) for k in range(2)], 1) * 0.9
a, b = int(18.75 * SR), int(20.0 * SR)
dip = np.stack([lp(music[a:b, k], 1500) for k in range(2)], 1)
fade = np.linspace(0, 1, b - a)[:, None]
music[a:b] = dip * (1 - fade) + music[a:b] * fade
# vinyl crackle + hiss
crack = np.zeros(N); idx = rng.integers(0, N, 1400); crack[idx] = rng.standard_normal(1400) * 0.25
music += np.stack([hp(crack, 1500) + hp(rng.standard_normal(N), 4000) * 0.004] * 2, 1)
# tape stop at the very end
a = int(29.1 * SR)
seg = music[a:].copy(); n = len(seg)
rate = np.linspace(1, 0.05, n); pos = np.cumsum(rate); pos = np.clip(pos, 0, n - 1)
music[a:] = np.stack([np.interp(pos, np.arange(n), seg[:, k]) for k in range(2)], 1) * np.linspace(1, 0, n)[:, None]

# ---------------- sound design ----------------
def noise(d): return rng.standard_normal(int(d * SR))
def roll(t0, t1, speed_fn, gain=1.0, seams=1.5):
    d = t1 - t0; t = t_(d); sp = speed_fn(t)
    rum = lp(noise(d), 260) * 1.5 + bp(noise(d), 600, 1800) * 0.25
    x = rum * (sp / 4.2) ** 0.8
    # seam clacks
    dist = np.cumsum(sp) / SR; k = np.floor(dist / seams); hits = np.where(np.diff(k) > 0)[0]
    for h in hits:
        c = lp(noise(0.06), 2500) * np.exp(-t_(0.06) / 0.012) * 1.2
        x[h:h + len(c)] += c[: len(x) - h] * min(1, sp[h] / 3)
    add(sfx, x * 0.35, t0, gain)
def bell(f, d=1.2):
    t = t_(d)
    return sum(np.sin(2 * np.pi * f * r * t) * np.exp(-t * (2 + r)) * a for r, a in ((1, 1), (2.76, 0.4), (5.4, 0.2))) * 0.2
def clink(f=3200):
    t = t_(0.25)
    return sum(np.sin(2 * np.pi * f * r * t) * np.exp(-t * 30 * r) for r in (1, 1.53, 2.31)) * 0.12
def thunk(f=90, d=0.18):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.05) + lp(noise(d), 800) * np.exp(-t / 0.02) * 0.6) * 0.5
def whoosh(d, lo, hi, gain=0.3):
    t = t_(d); x = bp(noise(d), lo, hi) * np.sin(np.pi * t / d) ** 2
    return x * gain
def beep(f=2100, d=0.08):
    t = t_(d); return np.sign(np.sin(2 * np.pi * f * t)) * 0.06 * np.minimum(1, (d - t) / 0.01)
def pop():
    t = t_(0.05); return np.sin(2 * np.pi * (900 - 6000 * t) * t) * np.exp(-t / 0.012) * 0.12
def scribble(d):
    t = t_(d); return bp(noise(d), 2500, 7000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 9 * t))) * 0.05

# S1 neon buzz + flicker zaps + distant car
t = t_(3.75); hum = sum(np.sin(2 * np.pi * 120 * k * t) / k for k in range(1, 8)) * 0.012
add(sfx, hum * np.minimum(1, t / 0.5), 0)
for z in (1.2, 1.45): add(sfx, hp(noise(0.08), 2000) * 0.25 * np.exp(-t_(0.08) / 0.02), z)
add(sfx, lp(whoosh(3.2, 100, 900, 0.25), 900), 0.2, 1.0, -0.6)
add(sfx, pop(), 1.25, 1.0, -0.4)
# S2 board rolls in and tail-stops
roll(3.75, 5.2, lambda t: np.maximum(0.2, 4.6 * (1 - t / 1.4)), 1.2)
add(sfx, bp(noise(0.45), 1500, 5000) * np.exp(-t_(0.45) / 0.15) * 0.25, 5.1)
add(sfx, thunk(70), 5.95, 1.2)
# S3 text pops
for i in range(7): add(sfx, pop(), 6.25 + 1.25 + i * 0.04, 1.0, 0.3)
# Interior room tone 8.75–20
t = t_(11.25); fl = sum(np.sin(2 * np.pi * 60 * k * t) / k ** 1.5 for k in range(1, 10)) * 0.006 + hp(noise(11.25), 3000) * 0.002
add(sfx, fl * np.minimum(1, t / 0.3) * np.minimum(1, (11.25 - t) / 0.3), 8.75)
# door chime + footsteps on tile
add(sfx, bell(1318), 8.8, 1.0, -0.3); add(sfx, bell(1046), 9.15, 1.0, -0.3)
for k in range(5): add(sfx, lp(thunk(140, 0.1), 3000) * 0.7, 8.95 + k * 0.48, 0.8, 0.1 * (-1) ** k)
# S5 fridge: unlatch, seal pop, cold whoosh, hum, can grab
add(sfx, thunk(160, 0.1), 11.4, 0.8)
add(sfx, whoosh(1.2, 300, 3000, 0.22), 11.45)
t = t_(2.3); add(sfx, np.sin(2 * np.pi * 50 * t) * 0.02 * np.minimum(1, t / 0.4), 11.45)
add(sfx, clink(3600), 12.67, 1.0, 0.2)
# S6 door swings shut, text pop
add(sfx, thunk(85, 0.25), 14.95, 1.1)
for i in range(4): add(sfx, pop(), 14.75 + i * 0.05, 0.8)
# S7 can down on counter, yawn, coins
add(sfx, thunk(220, 0.12), 16.6, 0.9); add(sfx, clink(2600), 16.61, 0.6)
t = t_(1.1); yaw = bp(noise(1.1), 300, 1400) * np.sin(np.pi * t / 1.1) ** 2 * 0.12
add(sfx, yaw, 16.45, 1.0, 0.2)
for k, f in enumerate((4200, 3900, 4600, 4100)): add(sfx, clink(f), 17.5 + k * 0.045, 0.8, 0.3)
add(sfx, pop(), 16.75, 0.8)
# S8 register
for k, at in enumerate((0.18, 0.5, 0.82)): add(sfx, beep(2100 if k < 2 else 2500), 18.75 + at, 1.0); add(sfx, hp(noise(0.02), 2000) * 0.08, 18.75 + at - 0.03)
add(sfx, thunk(120, 0.2), 19.75, 0.8); add(sfx, clink(5200), 19.78, 0.5)
# S9/S10 skating away, can crack
add(sfx, thunk(80, 0.15), 20.0, 1.0)
roll(20.0, 27.4, lambda t: np.full_like(t, 4.2), 1.0)
add(sfx, hp(noise(0.35), 2500) * np.exp(-t_(0.35) / 0.08) * 0.35, 20.8, 1.0)
add(sfx, clink(2900), 20.78, 0.8)
t = t_(1.6); add(sfx, sum(np.sin(2 * np.pi * 120 * k * t) / k for k in range(1, 6)) * 0.01 * np.sin(np.pi * t / 1.6), 21.1)
# S11 title: marker scribbles + hit
add(sfx, lp(noise(0.6), 200) * np.exp(-t_(0.6) / 0.2) * 0.4, 27.5)
add(sfx, scribble(0.45), 27.6); add(sfx, scribble(0.45), 27.85); add(sfx, scribble(0.35), 28.35)

# fade the board roll out with the crane
f0, f1 = int(25.5 * SR), int(27.4 * SR)
sfx[f0:f1] *= np.linspace(1, 0.25, f1 - f0)[:, None]

mix = music * 0.85 + sfx
mix[:int(0.6 * SR)] *= np.linspace(0, 1, int(0.6 * SR))[:, None]
mix = np.tanh(mix * 1.1) / 1.1
mix /= np.max(np.abs(mix)) * 1.05
wavfile.write(sys.argv[1] if len(sys.argv) > 1 else 'out/mix.wav', SR, (mix * 32767).astype(np.int16))
print('ok')

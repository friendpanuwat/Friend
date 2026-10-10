"""Original score + sound design for NITE SHIFT (15 s, 96 BPM). Everything is synthesized here.
usage: python3 audio.py out/mix.wav
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 48000
DUR = 15.0
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
# Dm9 | Bbmaj7 | Fmaj9 | C6  — sleepy night-shift lo-fi
CH = [[50, 53, 57, 60, 64], [46, 50, 53, 57, 62], [41, 45, 48, 52, 55], [48, 52, 55, 57, 62]]
ROOT = [38, 34, 41, 36]
MEL = [[(0.5, 72, 0.5), (1.5, 69, 0.5), (2.0, 65, 1.0)], [(0.5, 70, 0.5), (1.0, 69, 0.5), (2.5, 65, 0.75)],
       [(0.0, 69, 0.5), (0.75, 72, 0.5), (1.5, 76, 1.0)], [(0.5, 74, 0.5), (1.5, 72, 0.5), (2.0, 67, 1.5)]]
swing = BEAT / 2 * 0.58
for bar in range(6):
    t0 = bar * BAR; c = bar % 4
    if bar == 2:  # the ding: band stops, only a held pad remains
        add(music, pad(CH[c][:3], BAR), t0, 1.3)
        for m in CH[c]: add(music, rhodes(m, 0.5, 0.8), t0, 1.0, (m % 5 - 2) * 0.15)
        continue
    for m in CH[c]:
        add(music, rhodes(m, BAR * 0.9), t0, 1.0, (m % 5 - 2) * 0.15)
        add(music, rhodes(m, BEAT * 0.4, 0.6), t0 + BEAT * 2.5, 1.0, (m % 5 - 2) * 0.15)
    add(music, pad(CH[c][:3], BAR), t0, 1.0)
    if bar >= 3:
        add(music, bass(ROOT[c], BEAT * 1.4), t0); add(music, bass(ROOT[c], BEAT * 0.4), t0 + BEAT * 1.75)
        add(music, bass(ROOT[c] + 7, BEAT * 0.9), t0 + BEAT * 2.5); add(music, bass(ROOT[c] + 12, BEAT * 0.4), t0 + BEAT * 3.5)
        for b in range(4):
            bt = t0 + b * BEAT
            if b == 0 or (b == 2 and bar % 2 == 0): add(music, kick(), bt, 1.0 if bar == 5 else 0.75)
            if b == 2: add(music, kick(), bt + swing, 0.6)
            if b in (1, 3): add(music, snare(), bt + 0.012, 0.85 if bar == 5 else 0.6)
            add(music, hat(), bt, 0.7, -0.2); add(music, hat(b == 3), bt + swing, 0.5, -0.2)
    if bar == 5:
        for off, m, ln in MEL[c]: add(music, pluck(m, ln * BEAT + 0.2), t0 + off * BEAT, 1.0, 0.25)
# intro + dozing heard muffled (sleepy), opens up when the board rolls in
i0 = int(5.55 * SR)
music[:i0] = np.stack([lp(music[:i0, k], 900) for k in range(2)], 1) * 0.85
a0, a1 = int(5.55 * SR), int(7.5 * SR)
music[a0:a1] *= np.linspace(0.25, 0.6, a1 - a0)[:, None]
crack = np.zeros(N); idx = rng.integers(0, N, 700); crack[idx] = rng.standard_normal(700) * 0.25
music += np.stack([hp(crack, 1500) + hp(rng.standard_normal(N), 4000) * 0.004] * 2, 1)
a = int(14.35 * SR)
seg = music[a:].copy(); n = len(seg)
rate = np.linspace(1, 0.05, n); pos = np.clip(np.cumsum(rate), 0, n - 1)
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


# exterior ambience + neon buzz (0-2.5, 12.5-15)
for t0, d in ((0.0, 2.5), (12.5, 2.5)):
    t = t_(d); hum = sum(np.sin(2 * np.pi * 120 * k * t) / k for k in range(1, 8)) * 0.011
    add(sfx, hum * np.minimum(1, t / 0.3) + lp(noise(d), 500) * 0.015, t0)
add(sfx, hp(noise(0.08), 2000) * 0.2 * np.exp(-t_(0.08) / 0.02), 0.9)
add(sfx, pop(), 0.75, 1.0, -0.4)
# interior room tone (2.5-12.5): fluorescent buzz + fridge
t = t_(10.0); fl = sum(np.sin(2 * np.pi * 60 * k * t) / k ** 1.5 for k in range(1, 10)) * 0.006 + np.sin(2 * np.pi * 50 * t) * 0.006
add(sfx, fl * np.minimum(1, t / 0.2) * np.minimum(1, (10 - t) / 0.2), 2.5)
add(sfx, pop(), 3.15, 0.8, 0.5)
# slow sleepy breaths while dozing
for k in range(2): add(sfx, lp(bp(noise(1.2), 200, 900) * np.sin(np.pi * t_(1.2) / 1.2) ** 2, 900) * 0.05, 2.8 + k * 1.3)
# door bell + door
add(sfx, bell(1318, 1.6), 5.55, 1.3, -0.5); add(sfx, bell(1568, 1.4), 5.62, 0.8, -0.5)
add(sfx, whoosh(0.3, 150, 900, 0.2), 5.58, 1.0, 0.1)  # startled inhale
for i in range(5): add(sfx, pop(), 5.55 + i * 0.04, 0.8, -0.4)
add(sfx, thunk(70, 0.25), 7.55, 0.8, -0.5)
add(sfx, lp(noise(0.6), 2000) * np.exp(-t_(0.6) / 0.3) * 0.05, 7.5, 1.0, -0.5)  # street air
# board rolls across the tiles (tile seams every 0.31 m) and taps the counter
def spd(t):
    T = t + 0.0; k = np.clip(T / 3.2, 0, 1)
    return np.maximum(0.05, 3.4 * 3 * (1 - k) ** 2 / 3.2)
roll(7.85, 10.9, spd, 1.3, seams=0.31)
add(sfx, thunk(260, 0.12), 10.95, 0.7); add(sfx, clink(1800), 10.96, 0.3)
# "...?" and "...milo?" pops
for i in range(4): add(sfx, pop(), 9.1 + i * 0.05, 0.7, 0.4)
for i in range(8): add(sfx, pop(), 10.75 + i * 0.04, 0.8, 0.4)
# cat mrrp (soft purr)
t = t_(0.8); add(sfx, lp(noise(0.8), 300) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 26 * t))) * np.sin(np.pi * t / 0.8) * 0.12, 11.1, 1.0, -0.3)
# Milo running on the sidewalk outside
for k in range(9):
    at = 12.55 + k * 0.23
    if at < 14.6: add(sfx, lp(thunk(110, 0.08), 2500) * 0.9, at, 0.6, 0.3 - k * 0.07)
# title marker scribbles + hit
add(sfx, lp(noise(0.6), 200) * np.exp(-t_(0.6) / 0.2) * 0.35, 13.05)
add(sfx, scribble(0.4), 13.05); add(sfx, scribble(0.4), 13.25); add(sfx, scribble(0.25), 13.7)

mix = music * 0.85 + sfx
mix[:int(0.6 * SR)] *= np.linspace(0, 1, int(0.6 * SR))[:, None]
mix = np.tanh(mix * 1.1) / 1.1
mix /= np.max(np.abs(mix)) * 1.05
wavfile.write(sys.argv[1] if len(sys.argv) > 1 else 'out/mix.wav', SR, (mix * 32767).astype(np.int16))
print('ok')

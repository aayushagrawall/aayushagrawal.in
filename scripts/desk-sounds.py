"""Synthesised sounds for the desk (no samples): a can opening and a rain loop."""
import numpy as np, wave, sys
SR = 44100
rng = np.random.default_rng(7)

def write(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    with wave.open(name, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def onepole(x, a):  # simple lowpass
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y

def hp(x, a):
    return x - onepole(x, a)

def bandnoise(n, lo_a, hi_a):
    return hp(onepole(rng.standard_normal(n), lo_a), hi_a)

# ---- can opening: tab click, sharp pssht, then a soft fizz ----
n = int(SR * 1.3)
t = np.arange(n) / SR
x = np.zeros(n)
# tab lever click (two tiny metallic ticks)
for t0, amp in ((0.04, 0.6), (0.075, 1.0)):
    i = int(t0 * SR); m = int(0.006 * SR)
    burst = bandnoise(m, 0.6, 0.05) * np.exp(-np.linspace(0, 6, m))
    ring = np.sin(2 * np.pi * 3100 * np.arange(m) / SR) * np.exp(-np.linspace(0, 8, m)) * 0.5
    x[i:i + m] += amp * (burst + ring)
# the pssht: bright noise, fast attack, decays over ~0.35 s
i = int(0.08 * SR)
m = n - i
env = np.minimum(1, np.arange(m) / (0.004 * SR)) * np.exp(-np.arange(m) / (0.11 * SR))
hiss = bandnoise(m, 0.9, 0.25)
x[i:] += 1.4 * hiss * env
# fizz: sparse tiny pops fading out
pops = np.zeros(n)
for _ in range(260):
    k = int(rng.uniform(0.15, 1.25) * SR)
    pops[k] += rng.uniform(0.2, 1) * np.exp(-((k / SR - 0.15) / 0.45))
fizz = hp(onepole(pops, 0.7), 0.3) * 0.5
x += fizz + bandnoise(n, 0.8, 0.3) * 0.04 * np.exp(-t / 0.5) * (t > 0.1)
write('can_open.wav', x)

# ---- rain: 24 s loop of soft wash + droplets on a window ----
L = SR * 24
wash = onepole(onepole(rng.standard_normal(L), 0.12), 0.25)
wash = hp(wash, 0.002)
drops = np.zeros(L)
for _ in range(9000):
    k = rng.integers(0, L)
    drops[k] += rng.uniform(0.1, 1) ** 2
drops = hp(onepole(drops, 0.45), 0.08)
# slow swell so it doesn't sound static
swell = 0.8 + 0.2 * np.sin(2 * np.pi * np.arange(L) / L * 2)
r = (wash * 1.0 + drops * 0.35) * swell
# make it loop: crossfade the last 2 s into the start
F = SR * 2
fade = np.linspace(0, 1, F)
r[:F] = r[:F] * fade + r[-F:] * (1 - fade)
r = r[:-F]
write('rain.wav', r)
print('ok')

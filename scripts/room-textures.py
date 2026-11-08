"""Textures for the lo-fi bedroom around the desk (World/Room.ts).

  python3 scripts/room-textures.py FONT_DIR static/textures/room

FONT_DIR holds caveat-700.ttf (Caveat, SIL OFL), grotesk-700.ttf / grotesk-400.ttf
(Space Grotesk, SIL OFL) and pacifico.ttf (SIL OFL); the fonts end up only inside the images.
Everything here is drawn from scratch: no photos, no brand artwork.
"""
import math
import random
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FD, OUT = sys.argv[1], sys.argv[2]
random.seed(7)
rng = np.random.default_rng(7)


def font(name, size):
    return ImageFont.truetype(f'{FD}/{name}', size)


def save(im, name, q=86):
    im.save(f'{OUT}/{name}', quality=q, method=6)
    print(name, im.size)


def noise(w, h, amp, blur=1.2):
    n = Image.fromarray(np.uint8(np.clip(128 + rng.normal(0, amp, (h, w)), 0, 255)))
    return np.asarray(n.filter(ImageFilter.GaussianBlur(blur)), float) / 128.0 - 1


# ---------- walls: soft plaster, ambient occlusion where the wall meets the floor and the corners
def wall(name, ao_left, ao_right, w=1024, h=1024):
    v = np.linspace(0, 1, h)[:, None]  # 0 = top, 1 = floor
    x = np.linspace(0, 1, w)[None, :]
    shade = 1.0 - 0.10 * v  # a little darker low down
    shade = shade - 0.22 * np.clip((v - 0.86) / 0.14, 0, 1) ** 1.6  # floor contact
    if ao_left:
        shade = shade - 0.20 * np.clip((0.10 - x) / 0.10, 0, 1) ** 1.8
    if ao_right:
        shade = shade - 0.20 * np.clip((x - 0.90) / 0.10, 0, 1) ** 1.8
    shade = shade + 0.018 * noise(w, h, 40, 1.5)
    g = np.clip(shade * 250, 0, 255)
    im = Image.fromarray(np.uint8(np.stack([g, g, g], -1)))
    save(im, name)


# ---------- floor: light oak planks (drawn for multiply blending over the baked floor)
def floor(w=1024, h=1024):
    im = Image.new('RGB', (w, h))
    px = np.zeros((h, w, 3), float)
    plank_w = w // 6
    for i in range(6):
        x0 = i * plank_w
        offset = random.randint(0, h)
        tone = random.uniform(0.94, 1.04)
        xs = np.arange(x0, x0 + plank_w)
        ys = np.arange(h)
        X, Y = np.meshgrid(xs, ys)
        # fine, mostly straight grain running along the plank
        grain = 0.022 * np.sin(X * 0.21 + np.sin((Y + offset) * 0.004) * 1.5 + i * 3) + 0.012 * np.sin(X * 0.55 + i) + 0.018 * noise(plank_w, h, 50, 0.8)
        base = np.array([236, 214, 186]) * tone
        px[:, x0:x0 + plank_w] = base[None, None, :] * (1 + grain[..., None])
        # plank ends
        for cut in (offset % h, (offset + h // 2) % h):
            px[max(0, cut - 2):cut + 2, x0:x0 + plank_w] *= 0.86
        px[:, x0:x0 + 3] *= 0.84
    im = Image.fromarray(np.uint8(np.clip(px, 0, 255)))
    save(im, 'floor.webp')


# ---------- window: frame, sky, Bangalore-ish skyline (three moods)
SKIES = {
    'day': [(0, (136, 190, 236)), (0.7, (198, 226, 246)), (1, (236, 240, 244))],
    'sunset': [(0, (92, 86, 168)), (0.45, (240, 142, 150)), (0.8, (255, 190, 140)), (1, (255, 214, 168))],
    'night': [(0, (22, 18, 54)), (0.6, (52, 36, 96)), (1, (98, 60, 120))],
}


def grad(h, stops):
    out = np.zeros((h, 3))
    ys = np.linspace(0, 1, h)
    for i, y in enumerate(ys):
        for (a, ca), (b, cb) in zip(stops, stops[1:]):
            if a <= y <= b:
                t = (y - a) / (b - a)
                out[i] = np.array(ca) * (1 - t) + np.array(cb) * t
                break
    return out


def skyline_layers(w, base_y):
    random.seed(11)
    far, near = [], []
    x = -20
    while x < w:
        bw = random.randint(40, 110)
        bh = random.randint(60, 230)
        far.append((x, base_y - bh, x + bw, base_y))
        x += bw - random.randint(0, 10)
    x = -30
    while x < w:
        bw = random.randint(60, 150)
        bh = random.randint(110, 330)
        near.append((x, base_y - bh, x + bw, base_y + 40))
        x += bw + random.randint(-12, 18)
    return far, near


def window(mood):
    W, H = 800, 1000  # glass area plus frame
    im = Image.new('RGB', (W, H))
    sky = grad(H, SKIES[mood])
    arr = np.repeat(sky[:, None, :], W, axis=1)
    im = Image.fromarray(np.uint8(arr))
    d = ImageDraw.Draw(im, 'RGBA')
    base = int(H * 0.86)
    if mood == 'night':
        for _ in range(90):
            sx, sy = random.randint(0, W), random.randint(0, int(H * 0.55))
            r = random.choice((1, 1, 1, 2))
            d.ellipse([sx - r, sy - r, sx + r, sy + r], fill=(255, 250, 235, random.randint(120, 230)))
        # moon with a soft halo
        halo = Image.new('L', (W, H), 0)
        ImageDraw.Draw(halo).ellipse([520, 120, 700, 300], fill=150)
        halo = halo.filter(ImageFilter.GaussianBlur(40))
        im.paste((150, 140, 210), (0, 0), halo)
        d = ImageDraw.Draw(im, 'RGBA')
        d.ellipse([570, 170, 650, 250], fill=(255, 246, 222))
        d.ellipse([595, 160, 675, 240], fill=tuple(int(c) for c in sky[200]) + (255,))
    elif mood == 'sunset':
        sun = Image.new('L', (W, H), 0)
        ImageDraw.Draw(sun).ellipse([300, base - 260, 520, base - 40], fill=255)
        glow = sun.filter(ImageFilter.GaussianBlur(60))
        im.paste((255, 170, 120), (0, 0), glow)
        im.paste((255, 222, 170), (0, 0), sun)
        d = ImageDraw.Draw(im, 'RGBA')
    else:
        for cx, cy, s in ((180, 220, 1.0), (560, 140, 0.8), (640, 380, 0.6)):
            cl = Image.new('L', (W, H), 0)
            cd = ImageDraw.Draw(cl)
            for dx, dy, r in ((0, 0, 60), (55, -20, 70), (115, 5, 55), (60, 20, 60)):
                cd.ellipse([cx + dx * s - r * s, cy + dy * s - r * s, cx + dx * s + r * s, cy + dy * s + r * s], fill=230)
            im.paste((255, 255, 255), (0, 0), cl.filter(ImageFilter.GaussianBlur(6)))
        d = ImageDraw.Draw(im, 'RGBA')
    far, near = skyline_layers(W, base)
    farc = {'day': (150, 170, 196), 'sunset': (160, 110, 150), 'night': (52, 40, 92)}[mood]
    nearc = {'day': (110, 126, 156), 'sunset': (96, 66, 118), 'night': (28, 22, 54)}[mood]
    for b in far:
        d.rectangle(b, fill=farc)
    # a TV tower and a temple-ish dome in the far layer, for a bit of Bangalore
    d.rectangle([92, base - 330, 100, base], fill=farc)
    d.polygon([(80, base - 330), (112, base - 330), (96, base - 380)], fill=farc)
    d.pieslice([600, base - 300, 720, base - 180], 180, 360, fill=farc)
    d.rectangle([600, base - 240, 720, base - 150], fill=farc)
    random.seed(5)
    for b in near:
        d.rectangle(b, fill=nearc)
        if mood != 'day':
            # windows: warm at night, a few at sunset
            p = 0.38 if mood == 'night' else 0.12
            for wy in range(b[1] + 14, base - 6, 22):
                for wx in range(b[0] + 10, b[2] - 10, 18):
                    if random.random() < p:
                        c = random.choice([(255, 210, 140), (255, 230, 170), (190, 200, 255), (255, 170, 210)])
                        d.rectangle([wx, wy, wx + 8, wy + 11], fill=c + (235,))
        else:
            for wy in range(b[1] + 14, base - 6, 22):
                for wx in range(b[0] + 10, b[2] - 10, 18):
                    d.rectangle([wx, wy, wx + 8, wy + 11], fill=(150, 168, 196))
    # a few trees in front (Garden City)
    treec = {'day': (92, 136, 110), 'sunset': (80, 62, 96), 'night': (22, 30, 44)}[mood]
    for tx in range(-20, W + 40, 64):
        r = random.randint(36, 58)
        d.ellipse([tx - r, base - r * 0.9, tx + r, base + r], fill=treec)
    d.rectangle([0, base + 20, W, H], fill=treec)
    # glass reflection streaks
    refl = Image.new('L', (W, H), 0)
    rd = ImageDraw.Draw(refl)
    rd.polygon([(120, 0), (220, 0), (40, H), (-60, H)], fill=26)
    rd.polygon([(260, 0), (300, 0), (120, H), (80, H)], fill=18)
    im.paste((255, 255, 255), (0, 0), refl)
    # frame: white wood with a cross bar
    d = ImageDraw.Draw(im)
    fc, fs = (246, 244, 240), (214, 210, 204)
    t = 38
    d.rectangle([0, 0, W, t], fill=fc)
    d.rectangle([0, H - t, W, H], fill=fc)
    d.rectangle([0, 0, t, H], fill=fc)
    d.rectangle([W - t, 0, W, H], fill=fc)
    d.rectangle([W // 2 - 12, 0, W // 2 + 12, H], fill=fc)
    d.rectangle([0, int(H * 0.42) - 12, W, int(H * 0.42) + 12], fill=fc)
    for (x0, y0, x1, y1) in ((t, t, W // 2 - 12, int(H * 0.42) - 12), (W // 2 + 12, t, W - t, int(H * 0.42) - 12),
                             (t, int(H * 0.42) + 12, W // 2 - 12, H - t), (W // 2 + 12, int(H * 0.42) + 12, W - t, H - t)):
        d.line([x0, y0, x1, y0], fill=fs, width=5)
        d.line([x0, y0, x0, y1], fill=fs, width=5)
    save(im, f'window-{mood}.webp')


# ---------- posters (original art)
def poster_city():
    W, H = 600, 840
    im = Image.fromarray(np.uint8(np.repeat(grad(H, [(0, (40, 30, 86)), (0.5, (196, 104, 160)), (0.78, (255, 170, 130)), (1, (255, 214, 170))])[:, None, :], W, 1)))
    d = ImageDraw.Draw(im)
    d.ellipse([170, 300, 430, 560], fill=(255, 226, 170))
    for i, y in enumerate(range(450, 560, 18)):
        d.rectangle([150, y, 450, y + 6 + i], fill=(232, 136, 150))
    far, near = skyline_layers(W, 640)
    for b in near:
        d.rectangle(b, fill=(54, 34, 84))
    d.rectangle([0, 630, W, H], fill=(54, 34, 84))
    d.text((W // 2, 700), 'BENGALURU', font=font('grotesk-700.ttf', 66), anchor='mm', fill=(255, 226, 190))
    d.text((W // 2, 760), '12.97° N   77.59° E', font=font('grotesk-400.ttf', 26), anchor='mm', fill=(236, 170, 190))
    d.text((W // 2, 90), 'after hours', font=font('pacifico.ttf', 54), anchor='mm', fill=(255, 236, 214))
    border(im, 0)
    save(im, 'poster-city.webp')


def poster_sleep():
    W, H = 600, 840
    im = Image.new('RGB', (W, H), (250, 236, 214))
    d = ImageDraw.Draw(im)
    d.text((40, 70), '404', font=font('grotesk-700.ttf', 230), fill=(110, 84, 196))
    d.text((44, 330), 'sleep', font=font('grotesk-700.ttf', 120), fill=(236, 112, 150))
    d.text((44, 450), 'not found', font=font('grotesk-700.ttf', 92), fill=(40, 34, 70))
    d.ellipse([400, 600, 540, 740], fill=(255, 210, 110))
    d.ellipse([440, 586, 580, 726], fill=(250, 236, 214))
    for sx, sy, r in ((90, 640, 18), (180, 700, 12), (300, 620, 16), (250, 760, 10), (120, 770, 14)):
        q = r * 0.28  # a four-pointed sparkle
        d.polygon([(sx, sy - r), (sx + q, sy - q), (sx + r, sy), (sx + q, sy + q), (sx, sy + r), (sx - q, sy + q), (sx - r, sy), (sx - q, sy - q)], fill=(110, 84, 196))
    border(im, 0)
    save(im, 'poster-sleep.webp')


def border(im, _):
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, im.width - 1, im.height - 1], outline=(255, 255, 255), width=10)


# ---------- polaroids
def polaroid(name, caption, palette, motif):
    W, H = 400, 480
    im = Image.new('RGB', (W, H), (252, 251, 247))
    photo = Image.fromarray(np.uint8(np.repeat(grad(340, palette)[:, None, :], 360, 1)))
    pd = ImageDraw.Draw(photo, 'RGBA')
    motif(pd)
    im.paste(photo, (20, 20))
    d = ImageDraw.Draw(im)
    d.text((W // 2, 412), caption, font=font('caveat-700.ttf', 50), anchor='mm', fill=(54, 50, 74))
    save(im, name)


def m_upload(d):
    d.rounded_rectangle([110, 80, 250, 240], radius=18, fill=(255, 255, 255, 230))
    d.polygon([(180, 110), (140, 160), (165, 160), (165, 205), (195, 205), (195, 160), (220, 160)], fill=(120, 92, 210))


def m_bot(d):
    d.rounded_rectangle([110, 110, 250, 230], radius=30, fill=(255, 255, 255, 235))
    d.ellipse([140, 150, 165, 175], fill=(70, 70, 110))
    d.ellipse([195, 150, 220, 175], fill=(70, 70, 110))
    d.line([180, 110, 180, 80], fill=(255, 255, 255), width=8)
    d.ellipse([170, 66, 190, 86], fill=(255, 210, 110))
    d.arc([150, 175, 210, 210], 20, 160, fill=(70, 70, 110), width=6)


def m_fest(d):
    for i in range(14):
        x = 20 + i * 25
        d.polygon([(x, 30), (x + 22, 30), (x + 11, 62)], fill=[(255, 120, 150), (255, 210, 110), (120, 200, 230)][i % 3] + (255,))
    d.ellipse([110, 140, 250, 280], fill=(255, 236, 200, 230))
    d.text((180, 210), '25', font=font('grotesk-700.ttf', 64), anchor='mm', fill=(236, 96, 120))


def m_code(d):
    d.rounded_rectangle([40, 60, 320, 280], radius=14, fill=(30, 28, 50, 240))
    ys = range(90, 260, 24)
    for i, y in enumerate(ys):
        x0 = 64 + (i % 3) * 20
        d.rounded_rectangle([x0, y, x0 + random.randint(60, 180), y + 10], radius=5, fill=[(160, 130, 255), (255, 140, 180), (120, 220, 200)][i % 3])


# ---------- rug: a wavy checkerboard, white outside the circle (it's multiplied over the floor)
def rug(S=768):
    yy, xx = np.mgrid[0:S, 0:S] / S
    u = xx * 6 + 0.25 * np.sin(yy * 2 * math.pi * 2)
    v = yy * 6 + 0.25 * np.sin(xx * 2 * math.pi * 2)
    chk = ((np.floor(u) + np.floor(v)) % 2)[..., None]
    a = np.array([198, 182, 240])
    b = np.array([255, 246, 236])
    col = a * chk + b * (1 - chk)
    r = np.hypot(xx - 0.5, yy - 0.5)
    edge = np.clip((0.49 - r) / 0.012, 0, 1)[..., None]
    trim = ((r > 0.455) & (r < 0.475))[..., None]
    col = np.where(trim, np.array([150, 128, 214]), col)
    col = col * edge + 255 * (1 - edge)
    fuzz = 0.03 * noise(S, S, 60, 0.6)[..., None]
    col = np.clip(col * (1 + fuzz * edge), 0, 255)
    save(Image.fromarray(np.uint8(col)), 'rug.webp')


wall('wall-back.webp', True, True)
wall('wall-side.webp', False, True)
floor()
for m in ('day', 'sunset', 'night'):
    window(m)
poster_city()
poster_sleep()
polaroid('polaroid-1.webp', 'imgurr.me', [(0, (186, 160, 255)), (1, (255, 190, 220))], m_upload)
polaroid('polaroid-2.webp', 'my first bot!', [(0, (140, 210, 230)), (1, (190, 160, 255))], m_bot)
polaroid('polaroid-3.webp', 'utsav fest', [(0, (255, 214, 170)), (1, (255, 150, 170))], m_fest)
polaroid('polaroid-4.webp', '3am commits', [(0, (60, 50, 110)), (1, (150, 110, 200))], m_code)
rug()

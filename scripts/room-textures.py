"""Textures for the bedroom around the desk (World/Room.ts): a darker, moodier college room.

  python3 scripts/room-textures.py FONT_DIR static/textures/room

FONT_DIR holds caveat-700.ttf (Caveat), grotesk-700/400.ttf (Space Grotesk), bebas.ttf
(Bebas Neue), playfair-700.ttf / playfair-italic.ttf (Playfair Display) and oswald-300/600.ttf
(Oswald), all SIL OFL; the fonts end up only inside the images.
Everything here is drawn from scratch: no photos, no brand artwork. The film posters are for
made-up films with made-up credits.
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
        base = np.array([176, 128, 92]) * tone  # dark walnut (multiplied over a grey floor)
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
    'sunset': [(0, (38, 44, 92)), (0.5, (206, 96, 68)), (0.85, (255, 158, 88)), (1, (255, 196, 128))],
    'night': [(0, (8, 12, 26)), (0.6, (20, 30, 56)), (1, (44, 54, 82))],
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
        ImageDraw.Draw(halo).ellipse([520, 120, 700, 300], fill=120)
        halo = halo.filter(ImageFilter.GaussianBlur(40))
        im.paste((120, 140, 180), (0, 0), halo)
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
    farc = {'day': (150, 170, 196), 'sunset': (120, 76, 92), 'night': (30, 40, 64)}[mood]
    nearc = {'day': (110, 126, 156), 'sunset': (62, 40, 62), 'night': (14, 18, 34)}[mood]
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
                        c = random.choice([(255, 210, 140), (255, 226, 160), (255, 196, 120), (170, 220, 255)])
                        d.rectangle([wx, wy, wx + 8, wy + 11], fill=c + (235,))
        else:
            for wy in range(b[1] + 14, base - 6, 22):
                for wx in range(b[0] + 10, b[2] - 10, 18):
                    d.rectangle([wx, wy, wx + 8, wy + 11], fill=(150, 168, 196))
    # a few trees in front (Garden City)
    treec = {'day': (92, 136, 110), 'sunset': (52, 40, 52), 'night': (10, 16, 24)}[mood]
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
    fc, fs = (34, 34, 38), (58, 58, 64)  # black aluminium frame
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




# ---------- film grain helper
def grain(im, amt=14):
    a = np.asarray(im.convert('RGB'), float)
    a += rng.normal(0, amt, a.shape[:2])[..., None]
    return Image.fromarray(np.uint8(np.clip(a, 0, 255)))


def billing(d, W, y, color):
    """A made-up credits block, the small condensed text at the bottom of film posters."""
    f = font('oswald-300.ttf', 15)
    lines = ['KESTREL PICTURES PRESENTS  A NIGHTJAR FILM  MUSIC BY R. VARMA  EDITED BY J. COLE-MARSH',
             'PRODUCTION DESIGN A. DESAI  DIRECTOR OF PHOTOGRAPHY S. LINDQVIST  WRITTEN AND DIRECTED BY K. ARORA']
    for i, t in enumerate(lines):
        d.text((W // 2, y + i * 20), t, font=f, anchor='mm', fill=color)


def poster_static():
    W, H = 600, 900
    im = Image.new('RGB', (W, H), (12, 12, 14))
    # a block of TV static with one red line through it
    st = np.uint8(np.clip(rng.normal(120, 70, (360, 440)), 0, 255))
    stim = Image.fromarray(st).convert('RGB').filter(ImageFilter.GaussianBlur(0.6))
    im.paste(stim, (80, 150))
    d = ImageDraw.Draw(im)
    d.rectangle([80, 150, 520, 510], outline=(40, 40, 44), width=6)
    d.rectangle([60, 322, 540, 334], fill=(214, 28, 36))
    d.text((W // 2, 640), 'COLD STATIC', font=font('bebas.ttf', 132), anchor='mm', fill=(236, 232, 224))
    d.text((W // 2, 722), 'THE SIGNAL NEVER STOPS.', font=font('oswald-300.ttf', 26), anchor='mm', fill=(214, 28, 36))
    billing(d, W, 812, (120, 118, 112))
    d.text((W // 2, 868), 'COMING NEVER', font=font('oswald-600.ttf', 18), anchor='mm', fill=(160, 156, 150))
    save(grain(im, 12), 'poster-static.webp')


def poster_personal():
    W, H = 600, 900
    im = Image.new('RGB', (W, H), (232, 226, 214))
    d = ImageDraw.Draw(im)
    d.rectangle([292, 0, 304, H], fill=(178, 24, 30))
    d.text((52, 120), 'Nothing', font=font('playfair-700.ttf', 104), fill=(16, 16, 16))
    d.text((52, 240), 'Personal', font=font('playfair-italic.ttf', 112), fill=(16, 16, 16))
    d.text((54, 400), 'it was never about you.', font=font('oswald-300.ttf', 26), fill=(60, 58, 54))
    # a lone office tower at night, one window lit
    d.rectangle([360, 470, 520, 790], fill=(18, 18, 20))
    for y in range(490, 780, 26):
        for x in range(378, 510, 26):
            d.rectangle([x, y, x + 12, y + 14], fill=(46, 46, 50))
    d.rectangle([430, 594, 442, 608], fill=(255, 214, 120))
    billing(d, W, 832, (90, 86, 80))
    save(grain(im, 10), 'poster-personal.webp')


def poster_city():
    W, H = 600, 900
    sky = grad(H, [(0, (10, 6, 8)), (0.55, (90, 12, 18)), (0.8, (190, 40, 30)), (1, (40, 8, 10))])
    im = Image.fromarray(np.uint8(np.repeat(sky[:, None, :], W, 1)))
    d = ImageDraw.Draw(im)
    far, near = skyline_layers(W, 700)
    for b in far:
        d.rectangle(b, fill=(40, 6, 10))
    for b in near:
        d.rectangle(b, fill=(12, 4, 6))
    d.rectangle([0, 690, W, H], fill=(12, 4, 6))
    d.text((W // 2, 110), 'SLEEPLESS', font=font('bebas.ttf', 150), anchor='mm', fill=(240, 236, 230))
    d.text((W // 2, 228), 'CITY', font=font('bebas.ttf', 150), anchor='mm', fill=(240, 236, 230))
    d.text((W // 2, 320), 'NOBODY HERE IS WHO THEY SAY THEY ARE', font=font('oswald-300.ttf', 21), anchor='mm', fill=(255, 150, 120))
    billing(d, W, 780, (150, 120, 112))
    d.text((W // 2, 846), 'ONLY IN THEATRES  ·  MIDNIGHT', font=font('oswald-600.ttf', 20), anchor='mm', fill=(200, 170, 160))
    save(grain(im, 14), 'poster-city.webp')


def poster_404():
    W, H = 600, 900
    im = Image.new('RGB', (W, H), (16, 16, 18))
    d = ImageDraw.Draw(im)
    d.text((W // 2, 290), '404', font=font('bebas.ttf', 330), anchor='mm', fill=(236, 232, 224))
    d.rectangle([90, 470, 510, 478], fill=(214, 28, 36))
    d.text((W // 2, 560), 'SLEEP NOT FOUND', font=font('bebas.ttf', 74), anchor='mm', fill=(236, 232, 224))
    d.text((W // 2, 640), 'try again after the next commit', font=font('oswald-300.ttf', 26), anchor='mm', fill=(150, 146, 140))
    save(grain(im, 10), 'poster-404.webp')


# ---------- black-and-white polaroids
def polaroid_bw(name, caption, motif):
    W, H = 400, 480
    im = Image.new('RGB', (W, H), (238, 236, 230))
    photo = Image.new('L', (360, 340), 0)
    pd = ImageDraw.Draw(photo)
    for y in range(340):
        pd.line([0, y, 360, y], fill=int(40 + 60 * y / 340))
    motif(pd)
    photo = grain(photo.convert('RGB'), 16)
    im.paste(photo, (20, 20))
    d = ImageDraw.Draw(im)
    d.text((W // 2, 412), caption, font=font('caveat-700.ttf', 50), anchor='mm', fill=(40, 40, 46))
    save(im, name)


def bw_upload(d):
    d.rounded_rectangle([110, 80, 250, 240], radius=18, fill=210)
    d.polygon([(180, 110), (140, 160), (165, 160), (165, 205), (195, 205), (195, 160), (220, 160)], fill=40)


def bw_bot(d):
    d.rounded_rectangle([110, 110, 250, 230], radius=30, fill=220)
    d.ellipse([140, 150, 165, 175], fill=30)
    d.ellipse([195, 150, 220, 175], fill=30)
    d.line([180, 110, 180, 80], fill=220, width=8)
    d.ellipse([170, 66, 190, 86], fill=240)


def bw_crowd(d):
    for i in range(18):
        x = random.randint(-10, 360)
        r = random.randint(30, 52)
        d.ellipse([x - r, 260 - r * 0.6, x + r, 260 + r * 1.6], fill=random.randint(10, 30))
    for i in range(7):
        x = 30 + i * 50
        d.line([x, 0, x + 60, 200], fill=170, width=3)


def bw_code(d):
    d.rounded_rectangle([40, 60, 320, 280], radius=14, fill=18)
    for i, y in enumerate(range(90, 260, 24)):
        x0 = 64 + (i % 3) * 20
        d.rounded_rectangle([x0, y, x0 + random.randint(60, 180), y + 10], radius=5, fill=[200, 140, 110][i % 3])


# ---------- rug: charcoal with an off-white border (multiplied over the floor)
def rug_dark(Wd=1024, Hd=704):
    yy, xx = np.mgrid[0:Hd, 0:Wd]
    col = np.full((Hd, Wd, 3), [74, 74, 78], float)
    m = 40
    border = (xx < m) | (xx >= Wd - m) | (yy < m) | (yy >= Hd - m)
    inner = ((xx >= m + 26) & (xx < m + 40)) | ((xx >= Wd - m - 40) & (xx < Wd - m - 26)) | ((yy >= m + 26) & (yy < m + 40)) | ((yy >= Hd - m - 40) & (yy < Hd - m - 26))
    inner &= ~border
    col[inner] = [214, 208, 196]
    col *= (1 + 0.06 * noise(Wd, Hd, 70, 0.5))[..., None]
    col[border] = 255  # outside the rug: no change to the floor
    # fringe at the short ends
    for x in range(m, Wd - m, 9):
        col[m - 22:m, x:x + 4] = [200, 194, 182]
        col[Hd - m:Hd - m + 22, x:x + 4] = [200, 194, 182]
    save(Image.fromarray(np.uint8(np.clip(col, 0, 255))), 'rug.webp')


# ---------- slatted wood panel behind the desk
def slats(w=1024, h=1024):
    im = Image.new('RGB', (w, h), (20, 18, 18))  # dark felt between the slats
    a = np.asarray(im, float).copy()
    sw, gap = 46, 18
    x = 6
    i = 0
    while x < w:
        tone = 1 + 0.06 * math.sin(i * 1.7)
        g = 0.05 * noise(sw, h, 60, 0.7)
        base = np.array([120, 82, 56]) * tone
        a[:, x:x + sw] = base[None, None, :] * (1 + g[..., None])
        a[:, x:x + 4] *= 1.12  # lit edge
        a[:, x + sw - 5:x + sw] *= 0.7  # shadow edge
        x += sw + gap
        i += 1
    save(Image.fromarray(np.uint8(np.clip(a, 0, 255))), 'slats.webp')


# ---------- skateboard deck graphic (original)
def deck(w=320, h=1024):
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1], radius=w // 2, fill=255)
    body = Image.new('RGB', (w, h), (18, 18, 20))
    d = ImageDraw.Draw(body)
    for i, y in enumerate(range(300, 720, 60)):
        d.rectangle([0, y, w, y + 30], fill=(214, 28, 36) if i % 2 else (236, 232, 224))
    d.text((w // 2, 160), 'NIGHT', font=font('bebas.ttf', 96), anchor='mm', fill=(236, 232, 224))
    d.text((w // 2, 860), 'RIDE', font=font('bebas.ttf', 96), anchor='mm', fill=(214, 28, 36))
    for y in (110, 914):
        for x in (w // 2 - 40, w // 2 + 40):
            d.ellipse([x - 7, y - 7, x + 7, y + 7], fill=(90, 90, 96))
    im.paste(body, (0, 0), mask)
    im.save(f'{OUT}/deck.webp', quality=88, method=6)
    print('deck.webp', im.size)


wall('wall-back.webp', True, True)
wall('wall-side.webp', False, True)
floor()
for m in ('day', 'sunset', 'night'):
    window(m)
poster_static()
poster_personal()
poster_city()
poster_404()
polaroid_bw('polaroid-1.webp', 'imgurr.me', bw_upload)
polaroid_bw('polaroid-2.webp', 'first bot', bw_bot)
polaroid_bw('polaroid-3.webp', "utsav '25", bw_crowd)
polaroid_bw('polaroid-4.webp', '3am commits', bw_code)
rug_dark()
slats()
deck()

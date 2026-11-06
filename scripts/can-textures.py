"""Textures for the white energy can on the desk (generic design, no brand artwork).

Writes into static/textures/personal/:
  can-label.webp  the body wrap, with the scene's soft top-left lighting painted in
  can-metal.webp  brushed aluminium for the base and shoulder, same lighting
  can-lid.webp    the lid seen from above (rings, tab, shading)

Column x of a wrap texture maps to the angle theta = x / W * 2pi around the can,
the way three.js Cylinder/Lathe geometry lays out u, with the surface normal
(sin theta, 0, cos theta). The front of the can (towards the camera) is theta ~ -25 deg.
"""
import math, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

OUT = sys.argv[1]
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

FRONT = math.radians(-42)        # where the bolt sits; the wordmark runs to its right
LIGHT = math.radians(-50)        # key light comes from the front-left


def shading(W, H, base=0.60, amp=0.42, spec=0.20, aoBottom=0.18, aoTop=0.06):
    th = (np.arange(W) + 0.5) / W * 2 * math.pi
    d = np.cos(th - LIGHT)
    s = base + amp * np.clip(d, 0, 1) + 0.06 * np.clip(-d, 0, 1) * 0  # wrap light
    # soft glossy streak a little right of the key light (half vector towards camera)
    hl = np.exp(-((((th - math.radians(-38)) + math.pi) % (2 * math.pi) - math.pi) / 0.10) ** 2)
    s = s + spec * hl
    # dark terminator on the far side, faint bounce light from the desk
    s = np.clip(s, 0, 1.15)
    v = np.linspace(0, 1, H)[:, None]  # 0 top -> 1 bottom
    ao = 1 - aoBottom * np.clip((v - 0.80) / 0.20, 0, 1) ** 1.5 - aoTop * np.clip((0.06 - v) / 0.06, 0, 1)
    return s[None, :] * ao


def condensed_text(txt, font, squeeze, fill, pad=8):
    f = ImageFont.truetype(font[0], font[1])
    l, t, r, b = f.getbbox(txt)
    im = Image.new('L', (r - l + pad * 2, b - t + pad * 2), 0)
    ImageDraw.Draw(im).text((pad - l, pad - t), txt, font=f, fill=255)
    im = im.resize((max(1, int(im.width * squeeze)), im.height), Image.LANCZOS)
    col = Image.new('RGBA', im.size, fill)
    col.putalpha(im)
    return col


def label():
    W, H = 2048, 1024
    paint = np.array([243, 244, 246], float)
    img = Image.new('RGBA', (W, H), tuple(int(c) for c in paint) + (255,))
    d = ImageDraw.Draw(img)
    cx = W // 2  # drawn in the middle, then rolled round to FRONT
    shift = int(((FRONT % (2 * math.pi)) / (2 * math.pi)) * W) - cx

    def at(x):  # wrap-safe paste helper
        return x % W

    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    silver = (178, 186, 196, 255)
    ice = (150, 180, 205, 255)

    # two thin vertical pinstripes framing the design
    for off, w, c in ((-210, 10, silver), (-188, 4, ice), (188, 4, ice), (200, 10, silver)):
        ld.rectangle([cx + off, 40, cx + off + w, H - 40], fill=c)

    # a big angular bolt, drawn as one polygon in pale silver
    bolt = [(40, -330), (-70, 10), (5, 10), (-45, 330), (80, -60), (5, -60), (60, -330)]
    ld.polygon([(cx + x, H // 2 + y) for x, y in bolt], fill=(212, 218, 226, 255))
    ld.line([(cx + x, H // 2 + y) for x, y in bolt + bolt[:1]], fill=silver, width=4)

    # vertical wordmark running up the can
    word = condensed_text('ENERGY', (BOLD, 190), 0.62, (40, 46, 56, 255))
    word = word.rotate(90, expand=True)
    layer.alpha_composite(word, (cx + 92, H // 2 - word.height // 2))

    small = condensed_text('ZERO SUGAR', (BOLD, 40), 0.85, (110, 140, 168, 255))
    layer.alpha_composite(small, (cx - small.width // 2, H - 150))
    tiny = condensed_text('500 ml', (REG, 26), 1.0, (140, 146, 156, 255))
    layer.alpha_composite(tiny, (cx - tiny.width // 2, H - 100))
    top = condensed_text('LIGHT  ·  CRISP', (BOLD, 34), 0.9, (120, 128, 140, 255))
    layer.alpha_composite(top, (cx - top.width // 2, 70))

    img.alpha_composite(layer)
    arr = np.roll(np.array(img).astype(float), shift, axis=1)
    sh = shading(W, H)
    arr[..., :3] *= sh[..., None]
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    Image.fromarray(arr).convert('RGB').save(f'{OUT}/can-label.webp', quality=88)


def metal():
    W, H = 1024, 128
    rng = np.random.default_rng(3)
    base = 190 + rng.normal(0, 6, (H, W)).cumsum(axis=1) * 0  # flat
    brushed = np.repeat(rng.normal(0, 7, (1, W)), H, axis=0)
    arr = np.clip(base + brushed, 0, 255)
    sh = shading(W, H, base=0.55, amp=0.45, spec=0.35, aoBottom=0, aoTop=0)
    rgb = np.stack([arr * 0.98, arr * 1.0, arr * 1.04], -1) * sh[..., None]
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(f'{OUT}/can-metal.webp', quality=88)


def lid():
    S = 512
    img = Image.new('RGB', (S, S), (0, 0, 0))
    d = ImageDraw.Draw(img)
    c = S // 2
    # concentric rings from rim to the centre panel
    for r, col in ((256, (150, 156, 164)), (246, (206, 211, 218)), (232, (176, 182, 190)), (222, (196, 201, 208)), (200, (186, 191, 198))):
        d.ellipse([c - r, c - r, c + r, c + r], fill=col)
    # light from the front-left: a gradient over the whole disc
    yy, xx = np.mgrid[0:S, 0:S]
    g = 1.06 - 0.22 * ((xx - c) / S) - 0.10 * ((c - yy) / S)
    arr = np.array(img).astype(float) * g[..., None]
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    # the tab (texture top = back of the can), rivet in the middle
    tab = [c - 46, c - 150, c + 46, c + 10]
    d.rounded_rectangle(tab, radius=40, fill=(214, 218, 224), outline=(150, 156, 164), width=4)
    d.rounded_rectangle([c - 22, c - 120, c + 22, c - 70], radius=18, fill=(170, 176, 184))
    d.ellipse([c - 16, c - 16, c + 16, c + 16], fill=(160, 166, 174), outline=(130, 136, 144), width=3)
    # the opening, scored in front of the tab
    d.rounded_rectangle([c - 62, c + 30, c + 62, c + 150], radius=46, outline=(150, 156, 164), width=4)
    img = img.filter(ImageFilter.GaussianBlur(0.6))
    # transparent outside the disc
    mask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, S - 1, S - 1], fill=255)
    img = img.convert('RGBA')
    img.putalpha(mask)
    img.save(f'{OUT}/can-lid.webp', quality=88)


label()
metal()
lid()
print('ok')

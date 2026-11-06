"""'Open to internships' neon sign textures for the desk (lit and unlit).
Fonts: Pacifico and Quicksand (SIL OFL), rendered into the image only."""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
D = sys.argv[1]; OUT = sys.argv[2]
W, H = 1024, 600
SCRIPT = ImageFont.truetype(f'{D}/pacifico.ttf', 170)
CAPS = ImageFont.truetype(f'{D}/quicksand.ttf', 118)

def text_mask(stroke):
    m = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(m)
    # "Open to" in script, slightly tilted feel by offset; "INTERNSHIPS" in monoline caps
    d.text((W // 2, 205), 'Open to', font=SCRIPT, anchor='mm', fill=255, stroke_width=stroke, stroke_fill=255)
    d.text((W // 2, 430), 'INTERNSHIPS', font=CAPS, anchor='mm', fill=255, stroke_width=stroke, stroke_fill=255)
    return m

def tube_outline(width):
    # neon is a bent tube along the letter outlines: outer edge minus inner
    outer = text_mask(width)
    inner = text_mask(0).filter(ImageFilter.MinFilter(3))
    ring = ImageChops.subtract(outer, inner)
    return ring

def board(img, alpha):
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([18, 18, W - 18, H - 18], radius=36, fill=(255, 255, 255, alpha), outline=(255, 255, 255, alpha * 3), width=3)
    for x, y in ((48, 48), (W - 48, 48), (48, H - 48), (W - 48, H - 48)):
        d.ellipse([x - 9, y - 9, x + 9, y + 9], fill=(200, 205, 212, 255), outline=(120, 124, 130, 255), width=2)

def lit():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    board(img, 22)
    tube = tube_outline(7)
    color = (255, 106, 26)
    # wide soft glow, tighter glow, the colored tube, then a white-hot core
    for radius, a in ((26, 0.55), (10, 0.75)):
        g = tube.filter(ImageFilter.GaussianBlur(radius)).point(lambda v: min(255, int(v * a * 2.2)))
        layer = Image.new('RGBA', (W, H), color + (0,)); layer.putalpha(g)
        img = Image.alpha_composite(img, layer)
    layer = Image.new('RGBA', (W, H), (255, 140, 70, 0)); layer.putalpha(tube)
    img = Image.alpha_composite(img, layer)
    core = tube_outline(2).filter(ImageFilter.GaussianBlur(0.8))
    layer = Image.new('RGBA', (W, H), (255, 236, 214, 0)); layer.putalpha(core)
    img = Image.alpha_composite(img, layer)
    img.save(f'{OUT}/neon-on.webp', quality=90)
    return img

def unlit():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    board(img, 22)
    tube = tube_outline(7)
    layer = Image.new('RGBA', (W, H), (196, 150, 132, 0)); layer.putalpha(tube.point(lambda v: int(v * 0.9)))
    img = Image.alpha_composite(img, layer)
    hl = tube_outline(2)
    layer = Image.new('RGBA', (W, H), (236, 214, 204, 0)); layer.putalpha(hl.point(lambda v: int(v * 0.6)))
    img = Image.alpha_composite(img, layer)
    img.save(f'{OUT}/neon-off.webp', quality=90)
    return img

a = lit(); b = unlit()
prev = Image.new('RGB', (W, H * 2), (205, 207, 210))
prev.paste(a, (0, 0), a); prev.paste(b, (0, H), b)
prev.save(f'{D}/preview.png')
print('ok')

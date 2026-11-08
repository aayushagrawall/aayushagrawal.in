"""Bitmap-style serif fonts for AayushOS, made from Liberation Serif (SIL OFL 1.1).

Each glyph is rendered by FreeType in monochrome with full TrueType hinting (the way Windows 98
drew Times on screen, no smoothing) at one pixel size, and every lit pixel becomes a square in
the outline. At that CSS size every font pixel is one screen pixel, so the text is crisp.

  python3 scripts/pixel-fonts.py OUTDIR

writes  aos-pixel-serif.woff2       (regular, 18 px grid: the showcase body text)
        aos-pixel-serif-bold.woff2  (bold, 18 px grid: nav, sub-headings, bold text)

The fonts are renamed ("AOS Pixel Serif") as the OFL requires for modified fonts, since
"Liberation" is a Reserved Font Name. Needs: pip install freetype-py fonttools brotli
"""
import os
import sys

os.environ.setdefault('FREETYPE_PROPERTIES', 'truetype:interpreter-version=35')
import freetype  # noqa: E402
from fontTools.fontBuilder import FontBuilder  # noqa: E402
from fontTools.pens.ttGlyphPen import TTGlyphPen  # noqa: E402
from fontTools.misc.timeTools import timestampNow  # noqa: E402

SRC = '/usr/share/fonts/truetype/liberation/'
U = 64  # font units per pixel

CHARS = [c for c in range(0x20, 0x7F)] + [c for c in range(0xA0, 0x100)] + [
    0x2013, 0x2014, 0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E, 0x2020, 0x2021, 0x2022,
    0x2026, 0x2030, 0x2039, 0x203A, 0x20AC, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2212, 0x20B9,
]


def runs_to_rects(rows):
    """rows: list of (y, [(x0, x1), ...]). Merge identical runs on consecutive rows into rectangles."""
    rects, open_ = [], {}
    for y, runs in rows:
        nxt = {}
        for r in runs:
            if r in open_ and open_[r][1] == y + 1:
                top, _ = open_[r]
                nxt[r] = (top, y)
            else:
                nxt[r] = (y, y)
        for r, (top, bot) in open_.items():
            if r not in nxt or nxt[r][0] != top:
                rects.append((r[0], r[1], bot, top))
        open_ = nxt
    for r, (top, bot) in open_.items():
        rects.append((r[0], r[1], bot, top))
    return rects


def build(src_file, ppem, family, style, out):
    face = freetype.Face(SRC + src_file)
    face.set_pixel_sizes(0, ppem)
    flags = freetype.FT_LOAD_RENDER | freetype.FT_LOAD_TARGET_MONO | freetype.FT_LOAD_MONOCHROME
    glyphs, advances, cmap, order = {}, {}, {}, ['.notdef']
    empty = TTGlyphPen(None).glyph()
    glyphs['.notdef'] = empty
    advances['.notdef'] = (ppem // 2 * U, 0)
    for cp in CHARS:
        if face.get_char_index(cp) == 0:
            continue
        face.load_char(cp, flags)
        g = face.glyph
        bm = g.bitmap
        name = 'uni%04X' % cp
        pen = TTGlyphPen(None)
        rows = []
        for r in range(bm.rows):
            line = bm.buffer[r * bm.pitch:(r + 1) * bm.pitch]
            bits = []
            for col in range(bm.width):
                bits.append((line[col >> 3] >> (7 - (col & 7))) & 1)
            runs, x = [], 0
            while x < len(bits):
                if bits[x]:
                    s = x
                    while x < len(bits) and bits[x]:
                        x += 1
                    runs.append((s, x))
                else:
                    x += 1
            # pixel row r sits at y = top - 1 - r (in pixels above the baseline)
            rows.append((g.bitmap_top - 1 - r, runs))
        # runs_to_rects wants rows from top to bottom with y decreasing by one
        for x0, x1, ybot, ytop in runs_to_rects(rows):
            X0, X1 = (g.bitmap_left + x0) * U, (g.bitmap_left + x1) * U
            Y0, Y1 = ybot * U, (ytop + 1) * U
            pen.moveTo((X0, Y0)); pen.lineTo((X0, Y1)); pen.lineTo((X1, Y1)); pen.lineTo((X1, Y0)); pen.closePath()
        glyphs[name] = pen.glyph()
        adv = (g.advance.x + 32) >> 6
        advances[name] = (adv * U, 0)
        cmap[cp] = name
        order.append(name)
    # space-like characters
    if 0xA0 in cmap and 0x20 in cmap:
        advances[cmap[0xA0]] = advances[cmap[0x20]]

    upm = ppem * U
    asc = (face.size.ascender + 32) >> 6
    desc = -((-face.size.descender + 32) >> 6)
    fb = FontBuilder(upm, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    metrics = {}
    for n in order:
        g = glyphs[n]
        g.recalcBounds(fb.font['glyf'])
        metrics[n] = (advances[n][0], getattr(g, 'xMin', 0))
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=asc * U, descent=desc * U)
    fb.setupNameTable({
        'familyName': family,
        'styleName': style,
        'uniqueFontIdentifier': f'{family} {style}; made for aayushagrawal.in',
        'fullName': f'{family} {style}',
        'psName': (family + '-' + style).replace(' ', ''),
        'version': 'Version 1.0',
        'copyright': 'Copyright (c) 2010 Google Corporation, with Reserved Font Name Liberation; '
                     'copyright (c) 2012 Red Hat, Inc. Pixel conversion (c) 2026 Aayush Agrawal.',
        'licenseDescription': 'This Font Software is licensed under the SIL Open Font License, Version 1.1.',
        'licenseInfoURL': 'https://openfontlicense.org',
    })
    fb.setupOS2(sTypoAscender=asc * U, sTypoDescender=desc * U, sTypoLineGap=0,
                usWinAscent=asc * U, usWinDescent=-desc * U, fsType=0,
                usWeightClass=700 if style == 'Bold' else 400,
                fsSelection=0x20 if style == 'Bold' else 0x40)
    fb.setupPost()
    fb.setupHead(unitsPerEm=upm, macStyle=1 if style == 'Bold' else 0, created=timestampNow(), modified=timestampNow())
    fb.font.flavor = 'woff2'
    fb.save(out)
    print(out, len(order), 'glyphs', os.path.getsize(out), 'bytes')


if __name__ == '__main__':
    out = sys.argv[1]
    build('LiberationSerif-Regular.ttf', 18, 'AOS Pixel Serif', 'Regular', os.path.join(out, 'aos-pixel-serif.woff2'))
    build('LiberationSerif-Bold.ttf', 18, 'AOS Pixel Serif', 'Bold', os.path.join(out, 'aos-pixel-serif-bold.woff2'))

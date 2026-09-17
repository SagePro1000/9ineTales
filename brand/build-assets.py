"""Deterministic vector redraw studies; glyphs are outlined, not font-dependent."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from PIL import Image
import json, shutil

root = Path(__file__).resolve().parents[1]
assets = root / 'dist/assets'
logos = assets / 'logos'
font = TTFont(assets / 'fonts/font-1.ttf')
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
metrics = font['hmtx'].metrics
cap = font['OS/2'].sCapHeight

def lettering(text, x, baseline, width, height, color):
    advance = sum(metrics[cmap[ord(c)]][0] for c in text)
    sx, sy = width / advance, height / cap
    position = 0
    paths = []
    for c in text:
        name = cmap[ord(c)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen, (sx, 0, 0, -sy, x + position * sx, baseline)))
        paths.append(pen.getCommands())
        position += metrics[name][0]
    return '<path fill="' + color + '" d="' + ' '.join(paths) + '"/>'

def svg(view, content, label):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" role="img" aria-label="{label}">{content}</svg>\n'

ink, orange, paper = '#211A17', '#FF5A1F', '#FFF8F0'
frame = 'M24 50H536V326H338L255 389L266 326H24Z'
flame = 'M201 13C192 43 216 43 229 53C209 73 184 73 179 50C177 36 189 22 201 13Z'
for name, primary, secondary, edge, accent in [
    ('primary', orange, ink, ink, orange),
    ('primary-ink', ink, ink, ink, ink),
    ('primary-reversed', paper, paper, paper, paper),
]:
    content = f'<path d="{frame}" fill="none" stroke="{edge}" stroke-width="12" stroke-linejoin="miter"/>'
    if name == 'primary':
        content += '<path d="M38 65H521V311H334L273 358L278 311H38Z" fill="none" stroke="#FF5A1F" stroke-width="4"/>'
    content += lettering('9INE', 59, 189, 442, 110, primary)
    content += lettering('TALES', 59, 292, 442, 84, secondary)
    content += f'<path d="{flame}" fill="{accent}"/>'
    (logos / (name + '.svg')).write_text(svg('0 0 560 408', content, '9inetales stacked logo'))

def symbol(fill, glyph_color):
    return '<path d="M7 8H89V72H58L36 91L39 72H7Z" fill="'+fill+'"/>' + lettering('9', 30, 61, 37, 43, glyph_color)

(logos / 'symbol.svg').write_text(svg('0 0 96 96', symbol(orange, ink), '9inetales symbol'))
(logos / 'symbol-ink.svg').write_text(svg('0 0 96 96', symbol(ink, paper), '9inetales symbol in ink'))
(logos / 'symbol-reversed.svg').write_text(svg('0 0 96 96', symbol(paper, ink), '9inetales reversed symbol'))
for name, a, b, fill, glyph in [
    ('horizontal', orange, ink, orange, ink),
    ('horizontal-ink', ink, ink, ink, paper),
    ('horizontal-reversed', paper, paper, paper, ink),
]:
    content = '<g transform="translate(0 10)">' + symbol(fill, glyph) + '</g>'
    content += lettering('9INE', 113, 79, 190, 54, a)
    content += lettering('TALES', 310, 79, 236, 54, b)
    (logos / (name + '.svg')).write_text(svg('0 0 560 118', content, '9inetales horizontal logo'))

source = Path('/Users/user/.codex/generated_images/01a0af39-9711-7182-a6f2-721fac9000d5/exec-165c757e-613c-4539-8e0f-fc6a5af90922.png')
shutil.copy2(source, root / 'brand/concept-art-original.png')
im = Image.open(source)
im.save(assets / 'concept-art.webp', 'WEBP', quality=86, method=6)

# Serve compact fonts while retaining the licensed original TTFs in the brand kit.
css = (assets / 'fonts/fonts.css').read_text()
for path in sorted((assets / 'fonts').glob('*.ttf')):
    f = TTFont(path)
    f.flavor = 'woff2'
    target = path.with_suffix('.woff2')
    f.save(target)
    css = css.replace(path.name, target.name).replace("format('truetype')", "format('woff2')")
(assets / 'fonts/fonts.css').write_text(css)
(root / 'brand/tokens.json').write_text(json.dumps({
    'colors': {'orange': orange, 'orangeDark': '#C44012', 'ink': ink, 'paper': paper,
               'white': '#FFFFFF', 'muted': '#6B5E57', 'line': '#CFBEB0', 'tint': '#F6E7D7',
               'error': '#A52A24', 'success': '#236343'},
    'typography': {'display': 'Barlow Condensed', 'body': 'Source Sans 3'},
    'spacing': [4,8,12,16,24,32,48,64,96], 'radius': 2,
}, indent=2) + '\n')
print('Saved 9 outlined SVG logos, compact fonts, concept art, and design tokens.')

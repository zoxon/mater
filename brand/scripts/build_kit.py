#!/usr/bin/env python3
"""Build the Mater logo kit (mark 47, colour Slate). Standard library only.

Edit the PALETTE block to change a colour, then run: python3 build_kit.py   (writes ../svg).
The colours come from the palette of the sibling projects Lui and Axiom (`--color-slate-*` in `palette.css`).

The mark is a solid square with an m cut out of it and a backtick cut from its top edge.
Every line and every gap of the mark is 26 units wide on the 256 grid.
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'svg'
PALETTE = {
  'ink': '#0f172a',      # slate-900: the mark on light grounds
  'pale': '#f1f5f9',     # slate-100: the mark on dark grounds
  'ground': '#0f172a',   # slate-900: the ground of the tile
}

f = lambda v: f'{v:.1f}'.rstrip('0').rstrip('.')
poly = lambda pts: 'M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts) + 'Z'
rect = lambda x, y, w, h: f'M{f(x)} {f(y)}H{f(x + w)}V{f(y + h)}H{f(x)}Z'


def comb(x0, ytop, ybot, t, g):
  """The m: three stems of width t and a top bar of thickness t. The slits between the stems are g wide."""
  s = [x0, x0 + t + g, x0 + 2 * (t + g)]
  xr = s[2] + t
  return [(x0, ytop), (xr, ytop), (xr, ybot), (xr - t, ybot), (xr - t, ytop + t), (s[1] + t, ytop + t), (s[1] + t, ybot), (s[1], ybot),
          (s[1], ytop + t), (s[0] + t, ytop + t), (s[0] + t, ybot), (s[0], ybot)]


# Main cut on the 256 grid. Use it from 40 px up.
T, EDGE = 26, 28
LEAN = math.atan2(18, 34)
_m = comb(63, 92, 194, T, T)
_w, _shift = T / math.cos(LEAN), (66 - EDGE) * math.tan(LEAN)
_backtick = [(57, EDGE), (57 + _w, EDGE), (57 + _w + _shift, 66), (57 + _shift, 66)]
MAIN = rect(28, 28, 200, 200) + poly(_m) + poly(_backtick)

# Pixel cut on a 16 x 16 grid for exactly 16, 32 and 48 px. Every coordinate is an integer, so every edge is sharp.
# The lines and the gaps are 2 px. The backtick is a step of two blocks.
_pm = comb(3, 6, 13, 2, 2)
_pb = [(3, 1), (5, 1), (5, 3), (6, 3), (6, 4), (4, 4), (4, 3), (3, 3)]
PIXEL = rect(1, 1, 14, 14) + poly(_pm) + poly(_pb)

CRISP = ' shape-rendering="crispEdges"'


def svg(inner, root='', box='0 0 256 256'):
  return f'<svg xmlns="http://www.w3.org/2000/svg" {root}viewBox="{box}">{inner}</svg>\n'


def mark(d, colour, extra=''):
  return f'<path{extra} fill="{colour}" fill-rule="evenodd" d="{d}"/>'


def write(name, text):
  OUT.mkdir(parents=True, exist_ok=True)
  (OUT / name).write_text(text, encoding='utf-8')


ink, pale, ground = PALETTE['ink'], PALETTE['pale'], PALETTE['ground']
write('symbol-ink.svg', svg(f'<title>Mater</title>{mark(MAIN, ink)}'))
write('symbol-pale.svg', svg(f'<title>Mater</title>{mark(MAIN, pale)}'))
write('symbol-white.svg', svg(f'<title>Mater</title>{mark(MAIN, "#ffffff")}'))
write('symbol-black.svg', svg(f'<title>Mater</title>{mark(MAIN, "#000000")}'))
write('symbol-pixel-ink.svg', svg(f'<title>Mater</title>{mark(PIXEL, ink, CRISP)}', box='0 0 16 16'))
write('symbol-pixel-pale.svg', svg(f'<title>Mater</title>{mark(PIXEL, pale, CRISP)}', box='0 0 16 16'))
# Favicon: transparent, pixel cut, follows the browser theme. The rules use #fav so they stay inside the file.
css = f'#fav path{{fill:{ink}}}@media (prefers-color-scheme:dark){{#fav path{{fill:{pale}}}}}'
write('favicon.svg', svg(f'<style>{css}</style><title>Mater</title>{mark(PIXEL, ink, CRISP)}', 'id="fav" ', '0 0 16 16'))
# App icon: a full square (the platform rounds the corners). The rounded tile is for the README header only.
tile = (f'<title>Mater</title><rect{{R}} width="256" height="256" fill="{ground}"/>'
        f'<g transform="translate(48.6 48.6) scale(.62)">{mark(MAIN, pale)}</g>')
write('app-icon.svg', svg(tile.replace('{R}', '')))
write('app-icon-rounded.svg', svg(tile.replace('{R}', ' rx="56"')))
print('wrote the kit to', OUT)

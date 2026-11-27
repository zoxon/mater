# Mater logo guidelines

The logo is a solid square with an m cut out of it. A backtick cuts the square open at the top edge.
The m is a hole, so the ground shows through it. The backtick is the sign of a tagged template.
Every line and every gap of the mark is the same width.

## Colours

The colours come from the palette of the sibling projects Lui and Axiom (`--color-slate-*` in `palette.css`).

| Use | Ground | Mark colour | Token | Contrast |
|---|---|---|---|---|
| Default | Light (white) | `#0f172a` | `--color-slate-900` | 17.9:1 |
| Default | Dark (`#0f172a`) | `#f1f5f9` | `--color-slate-100` | 16.3:1 |
| App icon, avatar | Tile `#0f172a` | `#f1f5f9` | `--color-slate-900`, `--color-slate-100` | 16.3:1 |
| One colour, print | White | `#000000` | none | 21:1 |
| One colour, on a photo or a dark ground | Any dark | `#ffffff` | `--color-white` | 17.9:1 on `#0f172a` |

The rule is short:

- **On a light ground the mark is slate-900 (`#0f172a`) or black.**
- **On a dark ground the mark is slate-100 (`#f1f5f9`) or white.**

The mark has one colour. The m and the backtick are holes: do not fill them with another colour.

## Files

| File | Use |
|---|---|
| `svg/symbol-ink.svg` | Light grounds. |
| `svg/symbol-pale.svg` | Dark grounds. |
| `svg/symbol-white.svg`, `svg/symbol-black.svg` | One colour: photos, print. |
| `svg/symbol-pixel-ink.svg`, `svg/symbol-pixel-pale.svg` | Exactly 16, 32 or 48 px. Drawn on a 16 x 16 pixel grid: the edges are sharp. |
| `svg/favicon.svg`, `favicon.ico` | Browser tab. Transparent. The SVG follows the browser theme. |
| `svg/app-icon.svg` | Full square tile. The platform rounds the corners. |
| `svg/app-icon-rounded.svg` | Tile with rounded corners, for the README header only. |
| `png/avatar-512.png` | GitHub avatar. |
| `png/apple-touch-icon-180.png` | Apple touch icon. It has a solid ground on purpose. |

## Size and clear space

- Use the main cut from 40 px up.
- At exactly 16, 32 or 48 px (or a whole multiple) use the pixel cut. It is drawn on a 16 x 16 grid, so every edge falls on a pixel.
  A cut on a 256 grid blurs at these sizes. Do not show the pixel cut at 20, 24 or 40 px.
- Smallest size: 16 px.
- Clear space: keep free space of one quarter of the mark width on every side.
- The mark is a tile already. The favicon has no extra tile. The app icon puts the pale mark on a slate ground.

## Do not

- Do not rotate or mirror the mark.
- Do not round the corners of the mark. Sharp corners are part of the shape.
- Do not change the width of a line or a gap. All of them are the same.
- Do not close the cut at the top edge.
- Do not fill the m or the backtick with a colour.
- Do not add a gradient, a shadow or an outline.
- Do not use a mark colour that is not in the table above.
- Do not put the name in a font and call it a wordmark. The logo has no wordmark.

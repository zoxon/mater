# Mater brand

The logo of Mater: a solid square with an m cut out of it, cut open at the top edge by a backtick.
Use `guidelines.md` for the rules. Use this file to find the files and to understand the choices.

## What is here

| Path | What it is |
|---|---|
| `svg/` | The logo files: colour for light and dark grounds, pixel cuts, one colour, favicon, app icon. |
| `png/` | PNG exports: avatar 512, Apple touch icon 180, the symbol from 16 to 1024 px. |
| `favicon.ico` | Transparent icon with 16, 32 and 48 px, from the pixel cut. |
| `readme-header-light.svg`, `readme-header-dark.svg` | The README header as an image, one file for each GitHub theme. |
| `social-preview.png`, `social-preview.svg` | The GitHub social preview, 1280 x 640 px. The SVG is the source. |
| `guidelines.md` | Usage rules. |
| `preview.html` | The logo in real contexts. Open it in a browser. |
| `scripts/` | `build_kit.py` builds `svg/`. The other scripts come from the `design` plugin (`design-logo`). |

`brand/` is not in the npm package: `files` in `package.json` lists only `LICENSE`, `README.md` and `dist`.

## Quick use

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="brand/readme-header-dark.svg">
  <img src="brand/readme-header-light.svg" width="520" alt="Mater: foundational TemplateResult runtime for JSX and tagged-template UI">
</picture>
```

GitHub removes style attributes from README HTML, so the header is an image. An SVG image keeps its own styles.

- **GitHub avatar:** upload `png/avatar-512.png`.
- **GitHub social preview:** upload `social-preview.png` by hand (Settings, General, Social preview). GitHub has no API for it. The file must be under 1 MB.
- **Favicon:** `svg/favicon.svg` and `favicon.ico`. Link the SVG first: it follows the browser theme. The ICO is one colour (slate-900).

## Rebuild

Change a colour in the `PALETTE` block of `scripts/build_kit.py`, then run:

```bash
python3 scripts/build_kit.py
```

The PNG files, `favicon.ico`, the README headers, `preview.html` and the social preview come from the `design-logo` and `design-web-assets` skills of the `design` plugin.
`build_kit.py` needs only Python 3.

## Decisions (2026-11-27)

**Chosen:** concept 47. A solid square, an m of three stems under one bar cut out of it, and a backtick cut from the top edge.
Every line and every gap is 26 units on the 256 grid. The colour is slate (`slate-900` on light, `slate-100` on dark).

**Why this mark:**

- The name has three meanings, and the mark uses the first two: *mater* (mother, the source), *materia* (matter, the substance) and the English *matter*.
  The square is the matter. The m is the name. The m is seen only by what is missing, like dark matter, which cannot be seen but holds everything together.
  This is the role of Mater: it is the runtime under an interface.
- The backtick is the sign that starts a tagged template, the main way to use the library. It is not in the logos of the siblings.
- It reads at 16 px with the pixel cut, and the edges stay sharp at 16, 32 and 48 px.
- The sharp corners and the pixel grid match the logos of Lui and Axiom, so the projects look like a family.

**Colour:** slate is the colour of Axiom. Lui is blue. The colour of Mater is the same as the colour of Axiom, which is the weak point of this choice.
Amber and green were offered. Slate was chosen for its calm and for its contrast (17.9:1 on white).

**Not chosen, and why:**

| Concept | Reason |
|---|---|
| A plain m, slanted m, m with a backtick, light m, thick and thin m | A letter in a plain form is common. These are the base of the chosen mark. |
| A backtick alone, in a square, or with a square | Without code, the backtick reads as a slash or a door. |
| Parent and child squares, template slots, nested squares, bricks, hatched square, raised block | The child is lost at 16 px, the slots read as three dots, the nested squares as a target, the bricks as a firewall, the raised block as the copy icon. |
| Dot-matrix m, m coming into being, a field of squares with an m as the void | Noise at small sizes, or a QR code. |
| The name in a font (`` `mater` ``, mat[ ]er, mater.) | A typed name. The empty slot reads as a missing-glyph error. |
| t and a slot, t in a square | Read as "to", or as the Tumblr sign. |
| Pixel m in a solid block (39, 42, 43) | Clear at 16 px, but coarser than the chosen mark. |
| Apostrophe thicker than the lines (44, 45) | The wish was equal lines, not a thicker backtick (see 46 and 47). |
| 41 and 46, lines of different widths | The stems, the bar and the backtick were not the same width. 47 makes them equal. |

Colours not chosen: blue (the colour of Lui), green (the colour of success in the tokens of Lui), amber (the colour of a warning in them).

## Open checks

- Search for similar marks before public use. A letter in a square is a common shape, and the open cut makes the square look like a tab.
- "Mater" and "Matter" are common names. Check the trademark separately.
- Check the favicon in a real browser tab, light and dark. The preview page cannot show the dark tab by itself.
- Not tested: the shelf test next to lit-html, Preact, Solid and Hono, the colour-blind view, the white version on photos, print.
- The mark has no wordmark. The README header and the social preview use plain system-font text, not outlines.

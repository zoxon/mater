# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use `rtk` prefix for shell commands (see AGENTS.md).

```bash
rtk pnpm typecheck                       # tsc --noEmit
rtk pnpm test                            # vitest run (node env)
rtk pnpm vitest run src/__tests__/string.test.ts   # single file
rtk pnpm vitest run -t 'name'            # single test by name
rtk pnpm lint                            # eslint (@antfu config); lint:fix to autofix
rtk pnpm build                           # tsup -> dist (esm .mjs + cjs .cjs + dts)
```

Run the smallest relevant check before claiming done. Releases use changesets (`.changeset/`).

## Architecture

`@zoxon/mater` is a tiny TemplateResult runtime: `html` tagged templates and the JSX runtime both produce a `TemplateResult` (`strings` + `values`). Rendering is lazy.

- `src/core/` — value types: `TemplateResult` (memoizes `.html`), `RawHtml`/`raw()` (trusted, unescaped), `SafeHtml` (rendered output wrapper), `escape.ts`, `class-value.ts` (clsx-based).
- `src/render/string.ts` — the real renderer. Walks `strings`/`values`, detects attribute vs content position via regexes on the preceding string chunk (`attrs=`, `name=`), tracks tag state, and escapes values. All output is HTML string first.
- `src/render/attributes.ts` — attribute/`attrs` map rendering shared by the string renderer and JSX runtime.
- `src/render/dom.ts` — `.dom`/`.element` are built by parsing the rendered string via `<template>.innerHTML` (browser only); `.element` throws unless single root.
- `src/render/finalize.ts` — `render()`, the string boundary.
- `src/jsx-runtime.ts` / `jsx-dev-runtime.ts` — JSX `jsx`/`jsxs`/`Fragment` that build `TemplateResult`s via `html`/`raw`, reusing attribute rendering.

Entry points (see `tsup.config.ts`, `package.json` exports): `.` (index), `./browser`, `./jsx-runtime`, `./jsx-dev-runtime`. Self-import: `browser.ts` and `jsx-runtime.ts` import from the package name `@zoxon/mater` (`external` in tsup) so every entry shares one core instance instead of bundling copies. The name resolves to `src/` through `tsconfig` `paths` and `vitest.config.ts` aliases — keep both in sync when adding entries.

## Gotchas

- Attribute override in `renderToString`: `attrs=` always wins over a scalar attr of the same name on the same tag, regardless of order (a prior scalar is blanked in `parts`; a later scalar is skipped via `lockedAttrs`). Between two scalars, the later wins. `lockedAttrs` / `scalarAttrPartIndexes` reset at the first unquoted `>`. Change the quote/tag-close logic only with tests in `string.test.ts`.
- Attribute vs content position is inferred by `scanTagState` (tracks in-tag and quote state across string chunks) plus a regex on the preceding chunk — not a real HTML parser. `name=` in text content or comments is treated as text. Raw-text elements (`<script>`, `<style>`) are not special-cased.
- Throws `TypeError`: `RawHtml` in attribute position; functions, symbols, bigints and plain objects in content position; non-object `attrs=` value.
- `renderAttrValue` (`src/render/attributes.ts`) is the single choke point for all attribute paths (scalar, `attrs=`, JSX); it throws `TypeError` for `on*` names and `javascript:` / `vbscript:` URLs in `URL_ATTRS`. Add new attribute checks there, with tests in `security.test.ts`.
- `jsxDEV` is just `jsx`; no dev-only behavior.

Tests live in `src/__tests__/` (`*.test.ts[x]`); `tsconfig` sets `jsxImportSource: @zoxon/mater`.

## Contract (from AGENTS.md)

- Components return `TemplateResult`; `render()` only at string boundaries (SSR, serialization).
- Browser code uses `.dom`/`.element`, not `innerHTML`.
- `raw()` only for trusted developer HTML.
- Security stance: safe by default, `raw()` is the only opt-out, `attrs=` is a plain attribute spread. Guard against developer mistakes (idiot-proofing), not against a malicious developer — no sanitizers, URL allowlists, or Trusted Types. Inline `on*` handlers and `javascript:` URLs are intentionally rejected.
- Prefer existing tiny helpers; no new framework integrations unless they remove real repeated setup.
- Runtime behavior belongs in shared render/core modules, not docs examples. Add focused tests for parser/rendering changes. Keep README examples aligned with real exports.

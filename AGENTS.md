# Agent Instructions

## Project

`@zoxon/mater` is a small TemplateResult runtime for tagged-template and JSX UI.

Keep the core contract simple:

- Components return `TemplateResult`.
- `render()` is only the string boundary for SSR, serialization, and framework escape hatches.
- Browser code should use `.dom` or `.element` instead of `innerHTML` when possible.
- `raw()` is only for trusted developer-supplied HTML.

## Code Style

- Prefer the existing tiny helpers over new abstractions.
- Do not add framework integrations unless they remove real repeated setup.
- Keep runtime behavior in shared render/core modules, not in docs examples.
- Add focused tests for parser/rendering changes.
- Keep public README examples aligned with actual exports.

## Commands

Use `rtk` for shell commands.

```bash
rtk pnpm typecheck
rtk pnpm test
rtk pnpm lint
```

Before claiming a change is done, run the smallest relevant check.

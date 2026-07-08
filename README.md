# Mater

Mater is a foundational runtime for declarative UI. It turns JSX and tagged-template descriptions into concrete output such as HTML strings or DOM fragments — no framework, no virtual DOM.

## Why **Mater**?

In Latin, **Mater** means "mother"—the source from which something is born. It also shares its root with *materia* ("matter"), the substance from which things are made.

The library embodies both ideas: it is the foundational runtime from which user interfaces take shape, transforming declarative descriptions into concrete output.

## Public API

Install:

```bash
pnpm add @zoxon/mater
```

```ts
import { html, raw, render } from '@zoxon/mater'
import { html } from '@zoxon/mater/browser'
```

### `html\`...\`` → `TemplateResult`

Tagged template literal. Interpolated values are auto-escaped. Returns a `TemplateResult` — compose freely, render at the boundary.

```ts
const view = html`<button class=${'btn'} disabled=${true}>${label}</button>`
```

### `render(result)` → `string`

Converts a `TemplateResult` to a plain HTML string. Use at string boundaries (SSR, serialization).

```ts
const parser = new DOMParser()
const doc = parser.parseFromString(render(view), 'text/html')
container.replaceChildren(...Array.from(doc.body.childNodes))
```

### `raw(htmlString)` → `RawHtml`

Marks a string as pre-rendered, trusted HTML. Bypasses escaping. Use only for developer-supplied content — never for user input.

```ts
html`<div>${raw(trustedHtml)}</div>`
```

### `TemplateResult` projections

| Property | Returns | Description |
|---|---|---|
| `.html` | `SafeHtml` | Memoized rendered string (internal) |
| `.dom` | `DocumentFragment` | Fresh DOM fragment (browser only) |
| `.element` | `Element` | Single root element (browser only, throws for multi-root) |

## Interpolation rules

| Value type | Behaviour |
|---|---|
| `string`, `number` | Escaped and inserted as text |
| `TemplateResult` | Composed inline — no escaping |
| `RawHtml` | Inserted verbatim — no escaping |
| `null`, `undefined`, `false` | Omitted |
| `true` | Boolean attribute (in attribute position) |
| `Array` / `Iterable` | Each item rendered recursively |
| Object with `attrs=` | Spread as attribute map |

## Attribute sugar

```ts
// scalar
html`<input type=${'text'} name=${'email'} />`

// boolean
html`<input disabled=${true} required=${false} />`
// → <input disabled />

// class array (clsx)
html`<button class=${['btn', active && 'btn--active']}>OK</button>`

// attrs spread
html`<input attrs=${{ disabled: true, value: 'A&B' }} />`
// → <input disabled value="A&amp;B" />
```

`attrs=` wins over duplicate scalar attributes on the same element.

## Component pattern

Components return `TemplateResult`. Use `render()` only at the string boundary.

```ts
// component
export function Button({ label, disabled }: ButtonProps): TemplateResult {
  return html`<button class="button" disabled=${disabled}>${label}</button>`
}

// composition — no raw(), no .html.value
export function Card({ title, body }: CardProps): TemplateResult {
  return html`<div class="card">
    <h2>${title}</h2>
    ${Button({ label: 'OK', disabled: false })}
    <div>${raw(body)}</div>
  </div>`
}

// boundary — convert once, use the string
const htmlString = render(Card({ title: 'Hi', body: trustedHtml }))
```

## Server/client reuse

Keep shared components in plain TypeScript and return `TemplateResult`. Convert only at the boundary:

```ts
// CurrencyValue.ts
import { html, type TemplateResult } from '@zoxon/mater'

export interface CurrencyValueProps {
  value?: string | number | null
  precision?: number
  ticker?: string
  grayed?: boolean
  class?: string | string[]
}

export function CurrencyValue(props: CurrencyValueProps): TemplateResult {
  const value = props.value == null ? '-' : Number(props.value).toFixed(props.precision ?? 2)

  return html`<span class=${['currency-value', props.grayed && 'is-grayed', props.class]}>
    ${value}${props.ticker ? html` <small>${props.ticker}</small>` : null}
  </span>`
}
```

```astro
---
// CurrencyValue.astro
import { render } from '@zoxon/mater'
import { CurrencyValue } from './CurrencyValue'

const html = render(CurrencyValue(Astro.props))
---

<Fragment set:html={html} />
```

```ts
// client.ts
import { CurrencyValue } from './CurrencyValue'

currencyElement.replaceWith(CurrencyValue(props).element)
```

Use `.dom` instead of `.element` for multi-root templates.

### Astro with JSX

Use Mater's JSX runtime for `.tsx` components:

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@zoxon/mater"
  }
}
```

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  vite: {
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: '@zoxon/mater',
    },
  },
})
```

```tsx
// CurrencyValue.tsx
import type { TemplateResult } from '@zoxon/mater'

export interface CurrencyValueProps {
  value?: string | number | null
  precision?: number
  ticker?: string
  grayed?: boolean
  class?: string | string[]
}

export function CurrencyValue(props: CurrencyValueProps): TemplateResult {
  const value = props.value == null ? '-' : Number(props.value).toFixed(props.precision ?? 2)

  return (
    <span class={['currency-value', props.grayed && 'is-grayed', props.class]}>
      {value}
      {props.ticker ? <small> {props.ticker}</small> : null}
    </span>
  )
}
```

An Astro integration can wrap the Vite config, but projects still need TypeScript/editor JSX settings. Add one only when this setup is repeated enough to justify a preset.

## Browser projections

Import from the `/browser` entrypoint to access DOM projections:

```ts
import { html } from '@zoxon/mater/browser'

const view = html`<button>${'Save'}</button>`
view.dom // DocumentFragment
view.element // Element (single root)
```

`view.dom` always returns a fresh clone. `view.element` throws if the template has more than one root element.

## Package layout

```
src/
  index.ts          universal entrypoint (string rendering)
  browser.ts        browser entrypoint (+ DOM projections)
  core/
    escape.ts       HTML character escaping
    class-value.ts  clsx normalization for class=
    raw-html.ts     RawHtml class + raw()
    safe-html.ts    SafeHtml wrapper
    template-result.ts  TemplateResult with projections
    types.ts        shared value types
  render/
    string.ts       authoritative string renderer
    dom.ts          browser DOM projection helpers
    finalize.ts     render() public finalizer
```

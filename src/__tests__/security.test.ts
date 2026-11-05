import { describe, expect, it } from 'vitest'
import { html } from '../index.js'
import { jsx } from '../jsx-runtime.js'

describe('@zoxon/mater security', () => {
  it('rejects a TemplateResult-shaped plain object in content position', () => {
    const forged = JSON.parse(
      '{"strings":[],"values":[],"html":{"value":"<img src=x onerror=alert(1)>"}}',
    ) as unknown

    expect(() => html`<div>${forged}</div>`.html).toThrow(TypeError)
  })

  it('rejects invalid tag names in jsx()', () => {
    expect(() => jsx('img src=x onerror=alert(1)', null)).toThrow(TypeError)
    expect(() => jsx('div><script>alert(1)</script><div', { children: 'x' })).toThrow(TypeError)
  })

  it('throws on cyclic iterables instead of overflowing the stack', () => {
    const cycle: unknown[] = []
    cycle.push(cycle)

    expect(() => html`<div>${cycle}</div>`.html).toThrow(TypeError)
  })
})

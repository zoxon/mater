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

  it('rejects inline event handler attributes in every attribute path', () => {
    expect(() => html`<a onclick=${'alert(1)'}>x</a>`.html).toThrow(TypeError)
    expect(() => html`<a attrs=${{ onclick: 'alert(1)' }}>x</a>`.html).toThrow(TypeError)
    expect(() => html`<a attrs=${{ OnError: 'alert(1)' }}>x</a>`.html).toThrow(TypeError)
    expect(() => jsx('a', { onclick: 'alert(1)' }).html).toThrow(TypeError)
  })

  it('rejects javascript: and vbscript: URLs in URL attributes', () => {
    expect(() => html`<a href=${'javascript:alert(1)'}>x</a>`.html).toThrow(TypeError)
    expect(() => html`<a href=${' \tJaVa\nScript:alert(1)'}>x</a>`.html).toThrow(TypeError)
    expect(() => html`<a attrs=${{ href: 'vbscript:msgbox(1)' }}>x</a>`.html).toThrow(TypeError)
    expect(() => jsx('form', { action: 'javascript:alert(1)' }).html).toThrow(TypeError)
    expect(() => jsx('button', { formaction: 'javascript:alert(1)' }).html).toThrow(TypeError)
  })

  it('keeps safe URLs and non-URL attributes untouched', () => {
    expect(html`<a href=${'/docs'}>x</a>`.html.value).toBe('<a href="/docs">x</a>')
    expect(html`<a href=${'https://example.com'}>x</a>`.html.value)
      .toBe('<a href="https://example.com">x</a>')
    expect(html`<a title=${'javascript:alert(1)'}>x</a>`.html.value)
      .toBe('<a title="javascript:alert(1)">x</a>')
    expect(html`<a data-on=${'x'} class=${'one'}>x</a>`.html.value)
      .toBe('<a data-on="x" class="one">x</a>')
  })
})

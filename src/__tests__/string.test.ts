import { describe, expect, it } from 'vitest'
import { html, raw, RawHtml, SafeHtml, TemplateResult } from '../index.js'

describe('@zoxon/mater string runtime', () => {
  it('returns TemplateResult from html``', () => {
    const view = html`<p>hi</p>`
    expect(view).toBeInstanceOf(TemplateResult)
  })

  it('memoizes view.html', () => {
    const view = html`<p>${'safe'}</p>`
    expect(view.html).toBe(view.html)
    expect(view.html).toBeInstanceOf(SafeHtml)
  })

  it('escapes interpolated text', () => {
    const view = html`<div>${'<script>alert("x")</script>'}</div>`
    expect(view.html.value).toBe('<div>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</div>')
  })

  it('renders nested templates as trusted composed html', () => {
    const child = html`<span>${'child'}</span>`
    const parent = html`<div>${child}</div>`
    expect(parent.html.value).toBe('<div><span>child</span></div>')
  })

  it('renders raw html only in content positions', () => {
    const view = html`<div>${raw('<b>ok</b>')}</div>`
    expect(view.html.value).toBe('<div><b>ok</b></div>')
  })

  it('throws when raw() receives non-string input', () => {
    expect(() => raw(42 as never)).toThrow('raw() expects a string')
  })

  it('supports attrs object with boolean and scalar values', () => {
    const view = html`<input attrs=${{ disabled: true, value: 'A&B' }} />`
    expect(view.html.value).toBe('<input disabled value="A&amp;B" />')
  })

  it('lets attrs win over scalar sugar', () => {
    const view = html`<input attrs=${{ disabled: false }} disabled=${true} />`
    expect(view.html.value).toBe('<input />')
  })

  it('lets later scalar sugar win over earlier scalar sugar', () => {
    const view = html`<input value=${'first'} value=${'second'} />`
    expect(view.html.value).toBe('<input value="second" />')
  })

  it('keeps scalar attribute state when static attribute text contains >', () => {
    const view = html`<input value=${'first'} title="1 > 0" value=${'second'} />`
    expect(view.html.value).toBe('<input title="1 > 0" value="second" />')
  })

  it('serializes class sugar consistently', () => {
    const view = html`<button class=${['button', false, 'button--primary']}>x</button>`
    expect(view.html.value).toBe('<button class="button button--primary">x</button>')
  })

  it('throws when RawHtml is used in attribute position', () => {
    expect(() => html`<div data-x=${raw('<b>bad</b>')}></div>`.html.value).toThrow('RawHtml cannot be used in attribute position')
  })

  it('throws for unsafe attrs object names', () => {
    expect(() => html`<div attrs=${{ 'data-x onclick': 'bad' }}></div>`.html.value).toThrow('Invalid attribute name')
  })

  it('throws for unsupported content values', () => {
    expect(() => html`<div>${{ value: 'bad' } as never}</div>`.html.value).toThrow('Unsupported template value in content position')
    expect(() => html`<div>${(() => 'bad') as never}</div>`.html.value).toThrow('Unsupported template value in content position')
    expect(() => html`<div>${Symbol('bad') as never}</div>`.html.value).toThrow('Unsupported template value in content position')
    expect(() => html`<div>${1n as never}</div>`.html.value).toThrow('Unsupported template value in content position')
  })

  it('flattens iterables and skips nullish values', () => {
    const list = [html`<li>${'A'}</li>`, null, html`<li>${'B'}</li>`]
    const view = html`<ul>${list}</ul>`
    expect(view.html.value).toBe('<ul><li>A</li><li>B</li></ul>')
  })

  it('exports RawHtml class for internal checks', () => {
    expect(raw('<i>x</i>')).toBeInstanceOf(RawHtml)
  })

  it('escapes quotes in attributes through shared rendering', () => {
    const view = html`<input value=${'\"quoted\"'} />`
    expect(view.html.value).toBe('<input value=\"&quot;quoted&quot;\" />')
  })
})

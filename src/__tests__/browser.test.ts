// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { html } from '../index.js'

describe('@zoxon/mater browser projections', () => {
  it('creates fresh DocumentFragment instances', () => {
    const view = html`<div>${'x'}</div>`
    const first = view.dom
    const second = view.dom
    expect(first.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE)
    expect(second.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE)
    expect(first).not.toBe(second)
  })

  it('creates fresh Elements for single-root templates', () => {
    const view = html`<button>${'save'}</button>`
    expect(view.element.tagName).toBe('BUTTON')
    expect(view.element).not.toBe(view.element)
  })

  it('ignores surrounding text nodes when selecting single root element', () => {
    const view = html`${'\n'}<button>${'save'}</button>${'\n'}`
    expect(view.element.tagName).toBe('BUTTON')
  })

  it('throws for multi-root element projection', () => {
    const view = html`<span>A</span><span>B</span>`
    expect(() => view.element).toThrow('view.element requires a single root element')
  })

  it('materializes raw html through parsed string output', () => {
    const view = html`<div>${'<unsafe>'}${html`<span>${'ok'}</span>`}</div>`
    expect(view.dom.firstElementChild?.innerHTML).toBe('&lt;unsafe&gt;<span>ok</span>')
  })
})

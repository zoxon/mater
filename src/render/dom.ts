import type { TemplateResult } from '../core/template-result.js'

export function renderToDOM(result: TemplateResult): DocumentFragment {
  const template = document.createElement('template')
  template.innerHTML = result.html.value
  return template.content.cloneNode(true) as DocumentFragment
}

export function renderToElement(result: TemplateResult): Element {
  const fragment = renderToDOM(result)
  const elements = Array.from(fragment.children)
  const [element] = elements

  if (!element || elements.length !== 1)
    throw new Error('view.element requires a single root element')

  return element
}

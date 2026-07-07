import type { SafeHtml } from './safe-html.js'
import { renderToDOM, renderToElement } from '../render/dom.js'
import { renderToString } from '../render/string.js'

export class TemplateResult {
  private _html?: SafeHtml

  constructor(
    readonly strings: TemplateStringsArray,
    readonly values: unknown[],
  ) {}

  get html(): SafeHtml {
    this._html ??= renderToString(this)
    return this._html
  }

  get dom(): DocumentFragment {
    return renderToDOM(this)
  }

  get element(): Element {
    return renderToElement(this)
  }

  toString(): string {
    return this.html.value
  }
}

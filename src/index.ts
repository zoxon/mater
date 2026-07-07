import { TemplateResult } from './core/template-result.js'

export { raw, RawHtml } from './core/raw-html.js'
export { SafeHtml } from './core/safe-html.js'
export { TemplateResult } from './core/template-result.js'
export { render } from './render/finalize.js'

export function html(strings: TemplateStringsArray, ...values: unknown[]): TemplateResult {
  return new TemplateResult(strings, values)
}

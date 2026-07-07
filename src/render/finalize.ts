import type { TemplateResult } from '../core/template-result.js'

export function render(result: TemplateResult): string {
  return result.html.value
}

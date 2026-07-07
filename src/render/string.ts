import type { TemplateResult } from '../core/template-result.js'
import type { TemplateValue } from '../core/types.js'
import type { AttrMap, AttrValue } from './attributes.js'
import { escapeHtml } from '../core/escape.js'
import { RawHtml } from '../core/raw-html.js'
import { SafeHtml } from '../core/safe-html.js'
import { renderAttrsObject, renderAttrValue } from './attributes.js'

const ATTRS_CONTEXT_RE = /\sattrs=$/
const SCALAR_ATTR_CONTEXT_RE = /\s([^\s<>"'=/]+)=$/

function isTemplateResult(value: unknown): value is TemplateResult {
  if (!value || typeof value !== 'object')
    return false

  return 'strings' in value && 'values' in value && 'html' in value
}

function isIterable(value: unknown): value is Iterable<TemplateValue> {
  return value != null && typeof value !== 'string' && Symbol.iterator in new Object(value)
}

function isAttrObject(value: unknown): value is AttrMap {
  return Boolean(value)
    && typeof value === 'object'
    && !Array.isArray(value)
    && !(value instanceof RawHtml)
    && !isTemplateResult(value)
    && !isIterable(value)
}

function renderContentValue(value: TemplateValue): string {
  if (value == null)
    return ''
  if (value instanceof RawHtml)
    return value.value
  if (isTemplateResult(value))
    return value.html.value
  if (isIterable(value))
    return Array.from(value, item => renderContentValue(item)).join('')
  if (isAttrObject(value))
    throw new TypeError('Unsupported template value in content position')
  if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint' || typeof value === 'object')
    throw new TypeError('Unsupported template value in content position')

  return escapeHtml(value)
}

function clearTagStateIfTagClosed(
  lockedAttrs: Set<string>,
  scalarAttrPartIndexes: Map<string, number>,
  segment: string,
): void {
  if (hasUnquotedTagClose(segment)) {
    lockedAttrs.clear()
    scalarAttrPartIndexes.clear()
  }
}

function hasUnquotedTagClose(segment: string): boolean {
  let quote: '"' | '\'' | undefined

  for (const char of segment) {
    if (quote) {
      if (char === quote)
        quote = undefined
      continue
    }

    if (char === '"' || char === '\'') {
      quote = char
      continue
    }

    if (char === '>')
      return true
  }

  return false
}

function removePriorScalarAttrs(attrs: AttrMap, scalarAttrPartIndexes: Map<string, number>, parts: string[]): void {
  for (const name of Object.keys(attrs)) {
    const index = scalarAttrPartIndexes.get(name)
    if (index !== undefined)
      parts[index] = ''
  }
}

export function renderToString(result: TemplateResult): SafeHtml {
  const parts: string[] = []
  const lockedAttrs = new Set<string>()
  const scalarAttrPartIndexes = new Map<string, number>()

  for (let i = 0; i < result.values.length; i++) {
    const rawSegment = result.strings[i] ?? ''
    const value = result.values[i] as TemplateValue

    clearTagStateIfTagClosed(lockedAttrs, scalarAttrPartIndexes, rawSegment)

    if (ATTRS_CONTEXT_RE.test(rawSegment)) {
      const segment = rawSegment.replace(ATTRS_CONTEXT_RE, '')
      if (!isAttrObject(value))
        throw new TypeError('attrs= expects an object value')

      removePriorScalarAttrs(value, scalarAttrPartIndexes, parts)
      parts.push(segment, renderAttrsObject(value, lockedAttrs))
      continue
    }

    const scalarMatch = rawSegment.match(SCALAR_ATTR_CONTEXT_RE)
    if (scalarMatch) {
      const attrName = scalarMatch[1]
      const segment = rawSegment.slice(0, -scalarMatch[0].length)

      if (value instanceof RawHtml)
        throw new TypeError('RawHtml cannot be used in attribute position')

      parts.push(segment)

      const priorScalarIndex = scalarAttrPartIndexes.get(attrName)
      if (priorScalarIndex !== undefined)
        parts[priorScalarIndex] = ''

      const rendered = lockedAttrs.has(attrName) ? '' : renderAttrValue(attrName, value as AttrValue)
      const renderedIndex = parts.push(rendered) - 1
      if (!lockedAttrs.has(attrName))
        scalarAttrPartIndexes.set(attrName, renderedIndex)
      continue
    }

    parts.push(rawSegment, renderContentValue(value))
  }

  parts.push(result.strings[result.strings.length - 1] ?? '')

  return new SafeHtml(parts.join(''))
}

import type { TemplateValue } from '../core/types.js'
import type { AttrMap, AttrValue } from './attributes.js'
import { escapeHtml } from '../core/escape.js'
import { RawHtml } from '../core/raw-html.js'
import { SafeHtml } from '../core/safe-html.js'
import { TemplateResult } from '../core/template-result.js'
import { renderAttrsObject, renderAttrValue } from './attributes.js'

const ATTRS_CONTEXT_RE = /\sattrs=$/
const SCALAR_ATTR_CONTEXT_RE = /\s([^\s<>"'=/]+)=$/

function isTemplateResult(value: unknown): value is TemplateResult {
  return value instanceof TemplateResult
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

function renderContentValue(value: TemplateValue, ancestors = new Set<unknown>()): string {
  if (value == null)
    return ''
  if (value instanceof RawHtml)
    return value.value
  if (isTemplateResult(value))
    return value.html.value
  if (isIterable(value)) {
    if (ancestors.has(value))
      throw new TypeError('Cyclic iterable in content position')

    ancestors.add(value)
    const rendered = Array.from(value, item => renderContentValue(item, ancestors)).join('')
    ancestors.delete(value)
    return rendered
  }
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

interface TagScanState {
  inTag: boolean
  quote?: '"' | '\''
}

const TAG_START_RE = /[a-z/]/i

function scanTagState(segment: string, state: TagScanState): void {
  for (let i = 0; i < segment.length; i++) {
    const char = segment[i]

    if (state.quote) {
      if (char === state.quote)
        state.quote = undefined
    }
    else if (state.inTag) {
      if (char === '"' || char === '\'')
        state.quote = char
      else if (char === '>')
        state.inTag = false
    }
    else if (char === '<' && TAG_START_RE.test(segment[i + 1] ?? '')) {
      state.inTag = true
    }
  }
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
  const tagState: TagScanState = { inTag: false }

  for (let i = 0; i < result.values.length; i++) {
    const rawSegment = result.strings[i] ?? ''
    const value = result.values[i] as TemplateValue

    clearTagStateIfTagClosed(lockedAttrs, scalarAttrPartIndexes, rawSegment)
    scanTagState(rawSegment, tagState)
    const inAttrPosition = tagState.inTag && !tagState.quote

    if (inAttrPosition && ATTRS_CONTEXT_RE.test(rawSegment)) {
      const segment = rawSegment.replace(ATTRS_CONTEXT_RE, '')
      if (!isAttrObject(value))
        throw new TypeError('attrs= expects an object value')

      removePriorScalarAttrs(value, scalarAttrPartIndexes, parts)
      parts.push(segment, renderAttrsObject(value, lockedAttrs))
      continue
    }

    const scalarMatch = inAttrPosition ? rawSegment.match(SCALAR_ATTR_CONTEXT_RE) : null
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

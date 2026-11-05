import type { ClassValue } from 'clsx'
import { normalizeClassValue } from '../core/class-value.js'
import { escapeHtml } from '../core/escape.js'

export type AttrValue = ClassValue | string | number | boolean | null | undefined
export type AttrMap = Record<string, AttrValue>

const ATTR_NAME_RE = /^[^\s"'<>/=]+$/
const EVENT_HANDLER_ATTR_RE = /^on/i
const URL_ATTRS = new Set([
  'action',
  'cite',
  'data',
  'formaction',
  'href',
  'poster',
  'src',
  'xlink:href',
])
// eslint-disable-next-line no-control-regex -- browsers ignore control chars and spaces in URL schemes
const URL_IGNORED_CHARS_RE = /[\u0000-\u0020]/g
const SCRIPT_URL_RE = /^(?:javascript|vbscript):/i

function assertSafeAttr(name: string, value: AttrValue): void {
  if (EVENT_HANDLER_ATTR_RE.test(name))
    throw new TypeError(`Inline event handler attribute "${name}" is not allowed`)

  if (typeof value === 'string'
    && URL_ATTRS.has(name.toLowerCase())
    && SCRIPT_URL_RE.test(value.replace(URL_IGNORED_CHARS_RE, ''))) {
    throw new TypeError(`Script URL is not allowed in attribute "${name}"`)
  }
}

export function renderAttrValue(name: string, value: AttrValue): string {
  if (!ATTR_NAME_RE.test(name))
    throw new TypeError(`Invalid attribute name "${name}"`)

  assertSafeAttr(name, value)

  if (name === 'class')
    value = normalizeClassValue(value)

  if (value == null || value === false)
    return ''
  if (value === true)
    return ` ${name}`
  if (typeof value === 'string' || typeof value === 'number')
    return ` ${name}="${escapeHtml(value)}"`

  throw new TypeError(`Unsupported value for attribute "${name}"`)
}

export function renderAttrsObject(attrs: AttrMap, lockedAttrs = new Set<string>()): string {
  let rendered = ''

  for (const [name, value] of Object.entries(attrs)) {
    lockedAttrs.add(name)
    rendered += renderAttrValue(name, value)
  }

  return rendered
}

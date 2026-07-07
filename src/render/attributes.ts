import type { ClassValue } from 'clsx'
import { normalizeClassValue } from '../core/class-value.js'
import { escapeHtml } from '../core/escape.js'

export type AttrValue = ClassValue | string | number | boolean | null | undefined
export type AttrMap = Record<string, AttrValue>

const ATTR_NAME_RE = /^[^\s"'<>/=]+$/

export function renderAttrValue(name: string, value: AttrValue): string {
  if (!ATTR_NAME_RE.test(name))
    throw new TypeError(`Invalid attribute name "${name}"`)

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

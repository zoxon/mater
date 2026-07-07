/* eslint-disable ts/no-namespace */

import type { RawHtml, TemplateResult } from '@zoxon/mater'
import type { AttrMap, AttrValue } from './render/attributes.js'
import { html, raw } from '@zoxon/mater'
import { renderAttrsObject } from './render/attributes.js'

type Child
  = | TemplateResult
    | RawHtml
    | string
    | number
    | boolean
    | null
    | undefined
    | Iterable<Child>

type Props = Record<string, unknown> & {
  children?: Child
  class?: AttrValue
  className?: AttrValue
  attrs?: AttrMap
  style?: string | Record<string, string | number | null | undefined>
}

type StyleValue = string | number | null | undefined
type StyleMap = Record<string, StyleValue>
type AttributeValue = string | number | boolean | null | undefined

declare global {
  namespace JSX {
    type Element = TemplateResult

    interface ElementChildrenAttribute {
      children: unknown
    }

    interface IntrinsicAttributes {
      key?: string | number
    }

    interface HtmlTag extends IntrinsicAttributes {
      'children'?: Child
      'class'?: AttrValue
      'className'?: AttrValue
      'style'?: string | StyleMap
      'attrs'?: AttrMap
      'id'?: string | number
      'role'?: string
      'title'?: string
      'type'?: string
      'name'?: string
      'value'?: string | number
      'disabled'?: boolean
      'checked'?: boolean
      'selected'?: boolean
      'required'?: boolean
      'hidden'?: boolean
      'href'?: string
      'src'?: string
      'alt'?: string
      'accept'?: string
      'for'?: string
      'focusable'?: string | boolean
      'width'?: string | number
      'height'?: string | number
      'rows'?: string | number
      'colspan'?: string | number
      'rowspan'?: string | number
      'target'?: string
      'rel'?: string
      'placeholder'?: string
      'autocomplete'?: string
      'autofocus'?: boolean
      'readonly'?: boolean
      'multiple'?: boolean
      'open'?: boolean
      'roleDescription'?: string
      'aria-label'?: string
      [attribute: `data-${string}`]: AttributeValue
      [attribute: `aria-${string}`]: AttributeValue
    }

    interface IntrinsicElements {
      [tagName: string]: HtmlTag
    }
  }
}

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

function isIterable(value: unknown): value is Iterable<Child> {
  return value != null && typeof value !== 'string' && Symbol.iterator in new Object(value)
}

function normalizeChild(child: Child): Child {
  if (child == null || typeof child === 'boolean')
    return null

  if (isIterable(child))
    return Array.from(child, normalizeChild)

  return child
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)
}

function styleToString(style: string | Record<string, string | number | null | undefined>): string {
  if (typeof style === 'string')
    return style

  return Object.entries(style)
    .filter((entry): entry is [string, string | number] => entry[1] != null)
    .map(([name, value]) => `${toKebabCase(name)}:${value};`)
    .join('')
}

function normalizeAttributes(props: Props): AttrMap {
  const attrs: AttrMap = {}

  if (props.attrs)
    Object.assign(attrs, props.attrs)

  for (const [name, value] of Object.entries(props)) {
    if (name === 'children' || name === 'attrs' || name === 'key')
      continue
    if (name === 'className') {
      if (props.class === undefined)
        attrs.class = value as AttrValue
      continue
    }
    if (name === 'style' && value != null) {
      attrs.style = styleToString(value as NonNullable<Props['style']>)
      continue
    }

    attrs[name] = value as AttrValue
  }

  return attrs
}

export function jsx(name: string | ((props: Props) => TemplateResult), props: Props | null): TemplateResult {
  const attributes = props ?? {}

  if (typeof name === 'function')
    return name(attributes)

  const children = normalizeChild(attributes.children)
  const attrs = renderAttrsObject(normalizeAttributes(attributes))

  if (children == null) {
    if (VOID_ELEMENTS.has(name))
      return html`${raw(`<${name}${attrs} />`)}`

    return html`${raw(`<${name}${attrs}></${name}>`)}`
  }

  return html`${raw(`<${name}${attrs}>`)}${children}${raw(`</${name}>`)}`
}

export function jsxs(name: string | ((props: Props) => TemplateResult), props: Props | null): TemplateResult {
  return jsx(name, props)
}

export function Fragment({ children }: { children?: Child }): TemplateResult {
  return html`${normalizeChild(children)}`
}

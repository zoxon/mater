import type { AttrMap, AttrValue } from '../render/attributes.js'
import type { RawHtml } from './raw-html.js'
import type { TemplateResult } from './template-result.js'

export type { AttrMap, AttrValue }

export type TemplateValue
  = | AttrMap
    | RawHtml
    | TemplateResult
    | string
    | number
    | boolean
    | null
    | undefined
    | Iterable<TemplateValue>

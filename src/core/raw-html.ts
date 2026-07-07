export class RawHtml {
  constructor(public readonly value: string) {}
}

export function raw(value: string): RawHtml {
  if (typeof value !== 'string')
    throw new TypeError('raw() expects a string')

  return new RawHtml(value)
}

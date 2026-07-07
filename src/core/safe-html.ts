export class SafeHtml {
  constructor(public readonly value: string) {}

  toString(): string {
    return this.value
  }
}

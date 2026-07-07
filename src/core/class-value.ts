import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'

export function normalizeClassValue(value: ClassValue): string {
  return clsx(value)
}

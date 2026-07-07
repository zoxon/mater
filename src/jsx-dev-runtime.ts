import { jsx } from './jsx-runtime.js'

export { Fragment, jsx, jsxs } from './jsx-runtime.js'

export function jsxDEV(
  name: Parameters<typeof jsx>[0],
  attributes: Parameters<typeof jsx>[1],
): ReturnType<typeof jsx> {
  return jsx(name, attributes)
}

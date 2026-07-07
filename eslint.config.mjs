import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  jsx: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
})

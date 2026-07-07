import { defineConfig } from 'tsup'

const entries = [
  'src/index.ts',
  'src/browser.ts',
  'src/jsx-runtime.ts',
  'src/jsx-dev-runtime.ts',
]

export default defineConfig({
  entry: entries,
  outDir: 'dist',
  format: ['esm', 'cjs'],
  external: ['@zoxon/mater'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  target: 'es2022',
  esbuildOptions(options, context) {
    if (context.format === 'esm')
      options.outExtension = { '.js': '.mjs' }

    if (context.format === 'cjs')
      options.outExtension = { '.js': '.cjs' }
  },
})

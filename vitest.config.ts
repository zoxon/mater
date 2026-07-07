import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@zoxon/mater/jsx-dev-runtime',
        replacement: new URL('./src/jsx-dev-runtime.ts', import.meta.url).pathname,
      },
      {
        find: '@zoxon/mater/jsx-runtime',
        replacement: new URL('./src/jsx-runtime.ts', import.meta.url).pathname,
      },
      {
        find: '@zoxon/mater',
        replacement: new URL('./src/index.ts', import.meta.url).pathname,
      },
    ],
  },
  test: {
    include: ['src/__tests__/**/*.test.ts', 'src/__tests__/**/*.test.tsx'],
    environment: 'node',
  },
})

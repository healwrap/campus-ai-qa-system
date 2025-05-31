import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  minify: true,
  treeshake: true,
  splitting: true,
  format: ['esm'],
})

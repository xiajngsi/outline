import { defineConfig } from 'vite'
import {resolve} from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'outline',
      fileName: 'outline',
      formats: ['es', 'cjs', 'umd', 'iife']
    },
    minify: false,
    cssCodeSplit: false
  },
})

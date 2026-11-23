import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative URLs work on GitHub Pages at /<repo>/ and on custom domains.
  base: './',
})

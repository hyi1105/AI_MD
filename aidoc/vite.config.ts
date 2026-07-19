import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Embedded under AI_MD GitHub Pages at /AI_MD/aidoc/
// Relative base keeps local `web/` HTTP server and Pages both working.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../web/aidoc',
    emptyOutDir: true,
  },
})

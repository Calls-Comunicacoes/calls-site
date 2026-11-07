import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No GitHub Pages o site fica em /calls-site/. Com domínio próprio, trocar para '/'.
export default defineConfig({
  base: process.env.SITE_BASE ?? '/calls-site/',
  plugins: [react()],
})

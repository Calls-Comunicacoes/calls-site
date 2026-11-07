import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Site em domínio próprio (calls.fbrdev.com.br): raiz '/'. Para servir em /calls-site/, use SITE_BASE=/calls-site/.
export default defineConfig({
  base: process.env.SITE_BASE ?? '/',
  plugins: [react()],
})

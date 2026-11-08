// Atualiza a prévia web do app (public/app) a partir do calls-desktop.
// Uso: npm run sync:app  (precisa do calls-desktop ao lado, com dependências e .env)
import { execSync } from 'node:child_process'
import { cpSync, rmSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const desktop = resolve(site, '../calls-desktop')
if (!existsSync(desktop)) throw new Error('calls-desktop não encontrado ao lado do calls-site')

execSync('npx vite build --config vite.web.config.ts', { cwd: desktop, stdio: 'inherit' })
rmSync(resolve(site, 'public/app'), { recursive: true, force: true })
cpSync(resolve(desktop, 'dist-web'), resolve(site, 'public/app'), { recursive: true })
console.log('Prévia web copiada para public/app')

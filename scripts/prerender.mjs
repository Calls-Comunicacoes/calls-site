// Injeta o HTML pré-renderizado do React em dist/index.html.
// Assim o Googlebot, o Bingbot e as prévias de redes sociais leem o conteúdo sem executar JS.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const indexPath = resolve(root, 'dist/index.html')
const serverEntry = resolve(root, 'dist-ssr/entry-server.js')

const { render } = await import(pathToFileURL(serverEntry).href)
const template = await readFile(indexPath, 'utf8')
if (!template.includes('<!--app-html-->')) throw new Error('Marcador <!--app-html--> não encontrado em dist/index.html')

await writeFile(indexPath, template.replace('<!--app-html-->', render()))
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log('Pré-renderização concluída: dist/index.html')

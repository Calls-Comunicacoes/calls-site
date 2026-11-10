// Tira prints reais do app web do Calls com a conta de teste e dados fictícios (backend falso local).
//
// Uso:  node scripts/telas/capturar.mjs <pasta dist-web do calls-desktop buildada com VITE_SUPABASE_URL=http://127.0.0.1:54399> [--explorar]
// Saída: public/media/telas/*.webp (+ .png de trabalho em scripts/telas/saida/)
import { mkdirSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { execFileSync } from 'node:child_process'
import puppeteer from 'puppeteer-core'
import { APP_PORT, SESSION, startApi, startApp } from './mock.mjs'

const dist = resolve(process.argv[2] ?? '')
if (!existsSync(join(dist, 'index.html'))) throw new Error('Passe a pasta dist-web do app (com index.html).')
const explorar = process.argv.includes('--explorar')
const OUT = resolve(import.meta.dirname, 'saida')
const FINAL = resolve(import.meta.dirname, '../../public/media/telas')
mkdirSync(OUT, { recursive: true })
mkdirSync(FINAL, { recursive: true })

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const APP = `http://127.0.0.1:${APP_PORT}/app/`
const W = 1600, H = 900

const api = startApi()
const app = startApp(dist)
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', '--mute-audio', '--lang=pt-BR'],
  defaultViewport: { width: W, height: H, deviceScaleFactor: 1.5 },
})
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function shot(page, name) {
  // a faixa "prévia web" não aparece no app de Windows
  await page.addStyleTag({ content: '[role=note]{display:none!important}' })
  await sleep(700)
  const png = join(OUT, `${name}.png`)
  await page.screenshot({ path: png })
  // WebP leve para o site
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', png, '-c:v', 'libwebp', '-q:v', '82', join(FINAL, `${name}.webp`)])
  console.log('print:', name)
}

async function clickText(page, text, selector = '*') {
  const ok = await page.evaluate((text, selector) => {
    const els = [...document.querySelectorAll(selector)].filter((e) => e.offsetParent !== null)
    const el = els.find((e) => (e.getAttribute('aria-label') ?? '').includes(text) || (e.getAttribute('title') ?? '').includes(text))
      ?? els.reverse().find((e) => e.textContent?.trim() === text)
      ?? els.find((e) => e.textContent?.includes(text) && e.children.length < 4)
    if (!el) return false
    ;(el.closest('button,a,[role=button],li') ?? el).click()
    return true
  }, text, selector)
  if (!ok) console.warn('não achei:', text)
  await sleep(600)
  return ok
}

try {
  // 1) Tela de entrada (sem sessão): mostra o Callstor animado
  const login = await browser.newPage()
  await login.goto(APP, { waitUntil: 'networkidle0' })
  await sleep(2500)
  await shot(login, 'app-entrar')
  await login.close()

  // 2) Logado com a conta de teste
  const page = await browser.newPage()
  await page.goto(APP, { waitUntil: 'domcontentloaded' })
  await page.evaluate((s) => localStorage.setItem('sb-127-auth-token', JSON.stringify(s)), SESSION)
  await page.goto(APP, { waitUntil: 'networkidle0' })
  await sleep(2000)

  if (explorar) {
    await shot(page, 'explorar-inicio')
    const ui = await page.evaluate(() =>
      [...document.querySelectorAll('button,[role=button],a')].filter((e) => e.offsetParent).map((e) => `${e.tagName}|${e.getAttribute('aria-label') ?? ''}|${e.getAttribute('title') ?? ''}|${(e.textContent ?? '').trim().slice(0, 40)}`),
    )
    console.log(ui.join('\n'))
  } else {
    await shot(page, 'app-amigos')
    await clickText(page, 'Clã do Squad')
    await clickText(page, 'geral')
    await sleep(1500)
    await shot(page, 'app-chat')
    await clickText(page, 'Meu perfil e configurações')
    await sleep(1200)
    await shot(page, 'app-perfil')
    await page.keyboard.press('Escape')
    await sleep(600)
    const ui = await page.evaluate(() =>
      [...document.querySelectorAll('button,[role=button],a')].filter((e) => e.offsetParent).map((e) => `${e.getAttribute('aria-label') ?? ''}|${e.getAttribute('title') ?? ''}|${(e.textContent ?? '').trim().slice(0, 40)}`),
    )
    console.log(ui.slice(0, 60).join(' ; '))
  }
} finally {
  await browser.close()
  api.close()
  app.close()
}

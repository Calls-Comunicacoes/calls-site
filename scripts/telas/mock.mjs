// Backend falso do Calls (só para tirar prints do app com dados fictícios, na sua máquina).
// Responde como o Supabase: auth, REST por tabela, RPCs, storage público e realtime (presença).
// Nada aqui toca o servidor de verdade.
import http from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { WebSocketServer } from 'ws'

export const API_PORT = 54399
export const APP_PORT = 54400
const MEDIA = resolve(import.meta.dirname, '../../public/media')

// ---------- Dados fictícios ----------
const now = Date.now()
const ago = (min) => new Date(now - min * 60_000).toISOString()
const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`

export const ME = id(1)
const people = [
  [ME, 'Rafa', 'Moreira', 'rafa', '2048', 'jogando com a galera', 'Ele/dele'],
  [id(2), 'Mari', 'Costa', 'mari', '0731', 'stream às 21h', 'Ela/dela'],
  [id(3), 'João', 'Pires', 'joao', '1990', null, null],
  [id(4), 'Bia', 'Lima', 'bia', '4821', 'ranqueada até subir', null],
  [id(5), 'Callstor', 'Castor', 'callstor', '0001', 'mascote oficial', null],
  [id(6), 'Davi', 'Souza', 'davi', '3307', null, null],
  [id(7), 'Lu', 'Andrade', 'lu', '5512', 'estudando pra prova', null],
  [id(8), 'Theo', 'Ramos', 'theo', '9024', null, null],
]
const profiles = people.map(([pid, first, last, tag, code, status, pron], i) => ({
  id: pid, first_name: first, last_name: last, full_name: `${first} ${last}`, nametag: tag, tag_code: code,
  handle: `${tag}#${code}`, avatar_url: null, status_text: status, bio: i === 0 ? 'Mid main. Só jogo com headset.' : null,
  pronouns: pron, banner_color: ['#1670C0', '#B16914', '#23946A', '#6E48B8', '#070C4C', '#D7903A', '#1C7FD2', '#F2545B'][i],
  banner_style: 'gradiente',
}))

const S1 = id(101), S2 = id(102), S3 = id(103), S4 = id(104)
const servers = [
  { id: S1, name: 'Clã do Squad', kind: 'servidor', description: 'A call das 21h nunca fecha.', icon_url: null, owner_id: ME, created_at: ago(90000) },
  { id: S2, name: 'Ranqueada BR', kind: 'comunidade', description: 'Comunidade de ranqueada.', icon_url: null, owner_id: id(4), created_at: ago(80000) },
  { id: S3, name: 'Estúdio Pixel', kind: 'servidor', description: null, icon_url: null, owner_id: id(2), created_at: ago(70000) },
  { id: S4, name: 'Galera do RPG', kind: 'servidor', description: null, icon_url: null, owner_id: id(3), created_at: ago(60000) },
]
const ch = (n, server, name, kind, position, extra = {}) => ({ id: id(200 + n), server_id: server, name, kind, position, user_limit: null, has_password: false, ...extra })
const channels = [
  ch(1, S1, 'geral', 'texto', 0), ch(2, S1, 'clipes', 'texto', 1), ch(3, S1, 'memes', 'texto', 2),
  ch(4, S1, 'Ranqueada das 21h', 'voz', 3, { user_limit: 5 }), ch(5, S1, 'Reunião', 'voz', 4, { has_password: true }), ch(6, S1, 'AFK', 'voz', 5),
  ch(7, S2, 'avisos', 'texto', 0), ch(8, S2, 'procura-duo', 'texto', 1), ch(9, S2, 'Fila 1', 'voz', 2, { user_limit: 5 }),
  ch(10, S3, 'geral', 'texto', 0), ch(11, S3, 'Pixel Talk', 'voz', 1),
  ch(12, S4, 'mesa', 'texto', 0), ch(13, S4, 'Sessão de sexta', 'voz', 1),
]
const GERAL = id(201)
const msg = (n, author, min, content) => ({ id: id(300 + n), channel_id: GERAL, author_id: author, content, created_at: ago(min), edited_at: null })
const messages = [
  msg(1, id(4), 58, 'alguém pra ranqueada hoje? tô a 2 vitórias de subir'),
  msg(2, id(2), 55, 'bora! às 21h eu tô on'),
  msg(3, id(3), 52, 'eu levo o café ☕'),
  msg(4, ME, 47, 'fechou. criei a call "Ranqueada das 21h" com senha e limite de 5'),
  msg(5, id(5), 45, 'Lembrete do Callstor: o convite novo vale por 24h. Vazou? Gera outro que o antigo para na hora 🦫'),
  msg(6, id(2), 20, 'vou transmitir a tela em 1440p60 pra vocês verem a jogada'),
  msg(7, id(4), 12, 'que smoke foi aquela, mari 😂'),
  msg(8, id(6), 6, 'entrei agora, alguém me puxa pra call?'),
  msg(9, ME, 2, 'já tá aberta, entra lá!'),
]
const members = [ME, id(2), id(3), id(4), id(5), id(6), id(7), id(8)].flatMap((u) =>
  servers.map((s) => ({ server_id: s.id, user_id: u, role: u === s.owner_id ? 'dono' : 'membro' })),
)
const roles = [
  { id: id(401), server_id: S1, name: 'Dono', color: '#D7903A', position: 3, permissions: ['administrador'], hoist: true, is_default: false },
  { id: id(402), server_id: S1, name: 'Mod', color: '#1C7FD2', position: 2, permissions: ['gerenciar_canais', 'apagar_mensagens'], hoist: true, is_default: false },
  { id: id(403), server_id: S1, name: 'Squad', color: '#3CCF8E', position: 1, permissions: [], hoist: true, is_default: false },
  { id: id(404), server_id: S1, name: '@todos', color: null, position: 0, permissions: ['criar_convites', 'enviar_mensagens', 'entrar_em_calls', 'falar_em_calls', 'transmitir_tela'], hoist: false, is_default: true },
]
const memberRoles = [
  [ME, 401], [id(4), 402], [id(2), 403], [id(3), 403], [id(6), 403], [id(5), 402],
].map(([u, r]) => ({ server_id: S1, user_id: u, role_id: id(r) }))
const friendships = [
  { id: id(501), requester_id: ME, addressee_id: id(2), status: 'aceita', created_at: ago(9000), blocked_by: null },
  { id: id(502), requester_id: id(3), addressee_id: ME, status: 'aceita', created_at: ago(8000), blocked_by: null },
  { id: id(503), requester_id: ME, addressee_id: id(4), status: 'aceita', created_at: ago(7000), blocked_by: null },
  { id: id(504), requester_id: id(7), addressee_id: ME, status: 'pendente', created_at: ago(30), blocked_by: null },
  { id: id(505), requester_id: ME, addressee_id: id(6), status: 'aceita', created_at: ago(6000), blocked_by: null },
]
const tables = {
  profile_cards: profiles, profiles, servers, channels, messages, server_members: members,
  server_roles: roles, member_roles: memberRoles, friendships, invites: [],
}

// Presença: quem está online e quem está na call das 21h (com a Mari transmitindo).
const onlineState = Object.fromEntries(
  [[ME, 'online', true], [id(2), 'online', true], [id(3), 'ausente', false], [id(4), 'online', true], [id(5), 'online', false], [id(6), 'ocupado', true]]
    .map(([u, status, emCall]) => [u, { metas: [{ phx_ref: `r${u.slice(-3)}`, status, emCall, since: now - 3600_000 }] }]),
)
const CALL = id(204)
const voiceState = Object.fromEntries(
  [[id(2), false, true, true], [id(4), false, false, false], [id(6), true, false, false]].map(([u, muted, streaming, speaking]) => {
    const p = profiles.find((x) => x.id === u)
    return [u, { metas: [{ phx_ref: `v${u.slice(-3)}`, user_id: u, handle: p.handle, first_name: p.first_name, avatar_url: null, voice_channel_id: CALL, muted, deafened: false, streaming, speaking, call_since: now - 40 * 60_000 }] }]
  }),
)

// ---------- Auth ----------
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
const exp = Math.floor(now / 1000) + 3600 * 24 * 30
export const ACCESS_TOKEN = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: ME, role: 'authenticated', exp, aud: 'authenticated', email: 'rafa@exemplo.com' })}.c2ln`
const user = {
  id: ME, aud: 'authenticated', role: 'authenticated', email: 'rafa@exemplo.com', email_confirmed_at: ago(90000),
  app_metadata: { provider: 'email' }, user_metadata: { first_name: 'Rafa', full_name: 'Rafa Moreira' }, created_at: ago(90000),
}
export const SESSION = { access_token: ACCESS_TOKEN, token_type: 'bearer', expires_in: 3600 * 24 * 30, expires_at: exp, refresh_token: 'demo-refresh', user }

// ---------- REST ----------
function applyFilters(rows, params) {
  let out = rows
  for (const [k, v] of params) {
    if (['select', 'order', 'limit', 'offset', 'apikey'].includes(k)) continue
    if (v.startsWith('eq.')) out = out.filter((r) => String(r[k]) === v.slice(3))
    else if (v.startsWith('neq.')) out = out.filter((r) => String(r[k]) !== v.slice(4))
    else if (v.startsWith('in.(')) {
      const set = new Set(v.slice(4, -1).split(',').map((s) => s.replace(/"/g, '')))
      out = out.filter((r) => set.has(String(r[k])))
    }
  }
  const order = params.get('order')
  if (order) {
    const [col, dir] = order.split(',')[0].split('.')
    out = [...out].sort((a, b) => (a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) * (dir === 'desc' ? -1 : 1))
  }
  const limit = Number(params.get('limit'))
  if (limit) out = out.slice(0, limit)
  return out
}

const rpc = {
  my_permissions: () => ['administrador', 'gerenciar_servidor', 'gerenciar_canais', 'gerenciar_cargos', 'expulsar_membros', 'criar_convites', 'enviar_mensagens', 'apagar_mensagens', 'entrar_em_calls', 'falar_em_calls', 'transmitir_tela'],
  support_badge: () => 'fundador',
  supporter_wall: () => [],
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS,HEAD')
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
}
const send = (res, code, body, type = 'application/json') => {
  res.writeHead(code, { 'Content-Type': type })
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body))
}

const api = http.createServer((req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return send(res, 204, '')
  const url = new URL(req.url, `http://127.0.0.1:${API_PORT}`)
  const p = url.pathname

  if (p.startsWith('/auth/v1/')) {
    if (p.endsWith('/user')) return send(res, 200, user)
    if (p.endsWith('/settings')) return send(res, 200, { external: { email: true, google: true } })
    if (p.endsWith('/token')) return send(res, 200, SESSION)
    return send(res, 204, '')
  }
  if (p.startsWith('/rest/v1/rpc/')) {
    const fn = rpc[p.split('/').pop()]
    return send(res, 200, fn ? fn() : null)
  }
  if (p.startsWith('/rest/v1/')) {
    const table = p.split('/').pop()
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 201, [])
    let rows = applyFilters(tables[table] ?? [], url.searchParams)
    if (table === 'servers' && (url.searchParams.get('select') ?? '').includes('server_members')) {
      rows = rows.map((s) => ({ ...s, server_members: [{ user_id: ME }] }))
    }
    res.setHeader('Content-Range', `0-${Math.max(rows.length - 1, 0)}/${rows.length}`)
    if ((req.headers.accept ?? '').includes('vnd.pgrst.object')) return rows[0] ? send(res, 200, rows[0]) : send(res, 406, { message: 'no rows' })
    return send(res, 200, rows)
  }
  if (p.startsWith('/storage/v1/object/public/')) {
    // Só o Callstor tem foto; os outros ficam com as iniciais (o app mostra a reserva).
    const file = p.includes(id(5)) ? 'callstor-cor.webp' : p.includes(S1) ? 'logo-callstor.webp' : null
    if (file) return send(res, 200, readFileSync(join(MEDIA, file)), 'image/webp')
    return send(res, 404, { message: 'not found' })
  }
  if (p.startsWith('/functions/v1/')) return send(res, 503, { error: 'Demo: sem servidor de voz.' })
  return send(res, 404, { message: 'not found' })
})

// ---------- Realtime (Phoenix) ----------
const wss = new WebSocketServer({ noServer: true })
api.on('upgrade', (req, socket, head) => {
  if (!req.url.startsWith('/realtime/v1/websocket')) return socket.destroy()
  const vsn2 = req.url.includes('vsn=2')
  wss.handleUpgrade(req, socket, head, (ws) => {
    const out = (joinRef, ref, topic, event, payload) =>
      ws.send(JSON.stringify(vsn2 ? [joinRef, ref, topic, event, payload] : { join_ref: joinRef, ref, topic, event, payload }))
    ws.on('message', (raw) => {
      let m = JSON.parse(raw.toString())
      if (Array.isArray(m)) m = { join_ref: m[0], ref: m[1], topic: m[2], event: m[3], payload: m[4] }
      const { join_ref, ref, topic, event, payload } = m
      if (event === 'phx_join') {
        const pc = (payload?.config?.postgres_changes ?? []).map((b, i) => ({ ...b, id: 1000 + i }))
        out(join_ref, ref, topic, 'phx_reply', { status: 'ok', response: { postgres_changes: pc } })
        const state = topic === 'realtime:online' ? onlineState : topic.startsWith('realtime:server:') && topic.endsWith(S1) ? voiceState : null
        if (state) setTimeout(() => out(join_ref, null, topic, 'presence_state', state), 50)
      } else {
        out(join_ref, ref, topic, 'phx_reply', { status: 'ok', response: {} })
      }
    })
  })
})

// ---------- App web (estático, sem CSP para falar com este backend) ----------
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webm': 'video/webm', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' }
export function startApp(distDir) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x')
    let path = url.pathname.replace(/^\/app\/?/, '') || 'index.html'
    let file = join(distDir, path)
    if (!existsSync(file) || statSync(file).isDirectory()) file = join(distDir, 'index.html')
    let body = readFileSync(file)
    if (file.endsWith('index.html')) body = body.toString().replace(/<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?\/>/, '')
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  }).listen(APP_PORT, '127.0.0.1')
}

export function startApi() {
  return api.listen(API_PORT, '127.0.0.1')
}

if (process.argv[1] === import.meta.filename) {
  startApi()
  if (process.argv[2]) startApp(resolve(process.argv[2]))
  console.log(`Backend demo em http://127.0.0.1:${API_PORT}` + (process.argv[2] ? ` · app em http://127.0.0.1:${APP_PORT}/app/` : ''))
}

import { IconHeadset, IconMic, IconPhoneOff, IconScreen } from './Icons'

const SERVERS = ['CS', 'RP', 'LO', 'MC']
const TILES = [
  { n: 'felipe', c: 'a1', speaking: true },
  { n: 'mari', c: 'a2' },
  { n: 'joão', c: 'a3', muted: true },
  { n: 'bia', c: 'a4' },
]

/** Prévia do app desenhada em HTML/CSS (sem prints reais ainda). */
export function AppPreview({ logo }: { logo: string }) {
  return (
    <div className="preview-stage" role="img" aria-label="Prévia da janela do Calls: lista de servidores, canais de voz, uma call com quatro pessoas e uma transmissão de tela, e o chat ao lado.">
      <div className="mock layer" aria-hidden="true">
        <div className="mock-titlebar">
          <img src={logo} alt="" width={16} height={16} />
          <span>Calls</span>
          <i /><i /><i />
        </div>
        <div className="mock-body">
          <aside className="mock-rail">
            <span className="srv home"><img src={logo} alt="" /></span>
            <span className="sep" />
            {SERVERS.map((s, i) => <span key={s} className={`srv ${i === 0 ? 'active' : ''}`}>{s}</span>)}
            <span className="srv add">+</span>
          </aside>
          <aside className="mock-channels">
            <header>Clã do Squad</header>
            <p className="grp">Texto</p>
            <span className="ch"># geral</span>
            <span className="ch"># clipes</span>
            <p className="grp">Voz</p>
            <span className="ch voice on">🔊 Ranqueada <em>4/5</em></span>
            <div className="ch-users">
              {TILES.map((t) => <span key={t.n}><b className={`avatar xs ${t.c}`}>{t.n[0].toUpperCase()}</b>{t.n}</span>)}
            </div>
            <span className="ch voice">🔒 Reunião</span>
            <span className="ch voice">🔊 AFK</span>
            <footer className="me">
              <b className="avatar xs a1">F</b>
              <span>felipe<em>#4821</em></span>
            </footer>
          </aside>
          <section className="mock-call">
            <div className="share">
              <div className="share-screen">
                <span className="live">AO VIVO</span>
                <span className="q">1440p · 60</span>
                <div className="hud"><i /><i /><i /></div>
              </div>
              <small>felipe está transmitindo</small>
            </div>
            <div className="tiles">
              {TILES.map((t) => (
                <div key={t.n} className={`tile ${t.speaking ? 'speaking' : ''}`}>
                  <b className={`avatar md ${t.c}`}>{t.n[0].toUpperCase()}</b>
                  <span>{t.n}{t.muted && <IconMic width={12} height={12} className="muted" />}</span>
                </div>
              ))}
            </div>
            <div className="controls">
              <span className="ctl"><IconMic width={18} height={18} /></span>
              <span className="ctl"><IconHeadset width={18} height={18} /></span>
              <span className="ctl on"><IconScreen width={18} height={18} /></span>
              <span className="ctl leave"><IconPhoneOff width={18} height={18} /></span>
            </div>
          </section>
          <aside className="mock-chat">
            <header># geral</header>
            <div className="msg"><b className="avatar xs a2">M</b><div><strong>mari</strong><p>bora mais uma? 🎯</p></div></div>
            <div className="msg"><b className="avatar xs a3">J</b><div><strong>joão</strong><p>só se o felipe parar de errar a smoke</p></div></div>
            <div className="msg"><b className="avatar xs a1">F</b><div><strong>felipe</strong><p>abre a call que eu transmito 👀</p></div></div>
            <div className="compose">Mensagem em #geral</div>
          </aside>
        </div>
      </div>

      <div className="preview-callout c1 layer" aria-hidden="true">
        <strong>Qualidade da transmissão</strong>
        <div className="seg"><span>720p</span><span>1080p</span><span className="on">1440p</span></div>
        <div className="seg"><span>30 fps</span><span className="on">60 fps</span></div>
      </div>
      <div className="preview-callout c2 layer" aria-hidden="true">
        <strong>Nova call</strong>
        <label>Senha <span className="field">••••••</span></label>
        <label>Limite <span className="field">5 pessoas</span></label>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { DownloadButton } from './components/DownloadButton'
import { Campaign } from './components/Campaign'
import { APP_URL } from './config'
import { AppPreview } from './components/AppPreview'
import { IconCheck, IconGithub, IconLock } from './components/Icons'

const media = (f: string) => `${import.meta.env.BASE_URL}media/${f}`

export function App() {
  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <Nav />
      <main id="conteudo">
        <Hero />
        <Features />
        <CallsPlus />
        <Campaign />
        <Faq />
        <Close />
      </main>
      <Footer />
    </>
  )
}

function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#topo" className="brand" aria-label="Calls, voltar ao início">
          <img src={media('logo-callstor.webp')} alt="" width={42} height={42} />
          <span translate="no">Calls</span>
        </a>
        <nav className="nav-links" aria-label="Seções">
          <a href="#recursos">Recursos</a>
          <a href="#calls-plus">Calls+</a>
          <a href="#faq">Dúvidas</a>
          <a href="#apoie">Apoie</a>
        </nav>
        <a href={APP_URL} className="btn btn-sm btn-outline nav-cta">Entrar</a>
      </div>
    </header>
  )
}

/* ---------- Hero: o Callstor no setup, em vídeo ---------- */

const HOLD_MS = 2000 // quanto tempo o Callstor fica parado antes de "acordar"
const EASE_MS = 1400 // tempo para o vídeo sair de câmera lenta até a velocidade normal

function Hero() {
  const video = useRef<HTMLVideoElement>(null)
  const ramp = useRef(0)
  const [playing, setPlaying] = useState(true)
  const [awake, setAwake] = useState(false)

  useEffect(() => {
    const v = video.current
    if (!v) return
    // Movimento reduzido: fica o quadro parado (poster), sem zoom.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPlaying(false)
      setAwake(true)
      return
    }
    // Começa o "respiro": zoom lento sobre o quadro parado.
    const wake = window.setTimeout(() => setAwake(true), 60)
    const timer = window.setTimeout(() => {
      if (!v.paused || v.dataset.userPaused) return
      // Solta o vídeo em câmera lenta e acelera suave até 1x (ease-out).
      const t0 = performance.now()
      v.playbackRate = 0.2
      void v.play().catch(() => setPlaying(false))
      ramp.current = window.setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / EASE_MS)
        v.playbackRate = 0.2 + 0.8 * (1 - Math.pow(1 - k, 3))
        if (k >= 1) clearInterval(ramp.current)
      }, 50)
    }, HOLD_MS)
    return () => {
      clearTimeout(wake)
      clearInterval(ramp.current)
      clearTimeout(timer)
    }
  }, [])

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (playing) {
      clearInterval(ramp.current)
      v.pause()
      v.dataset.userPaused = '1'
      setPlaying(false)
    } else {
      delete v.dataset.userPaused
      v.playbackRate = 1
      void v.play()
      setPlaying(true)
    }
  }

  return (
    <section className="hero" id="topo">
      <video
        ref={video}
        className={`hero-video${awake ? ' is-awake' : ''}`}
        poster={media('hero-callstor-poster.webp')}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={media('hero-callstor.webm')} type="video/webm" />
        <source src={media('hero-callstor.mp4')} type="video/mp4" />
      </video>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1>O castor já tá de headset.</h1>
          <p className="lead">
            E a galera já tá na call. O Calls junta voz, tela em 1440p60 e chat num app só, de graça, para Windows.
            Cria a call, põe senha se quiser e manda o convite.
          </p>
          <div id="baixar" className="hero-cta">
            <DownloadButton />
            <p className="hero-web">
              Sem Windows agora? <a href={APP_URL}>Crie sua conta e use a prévia no navegador</a>.
            </p>
          </div>
        </div>
      </div>
      <button type="button" className="hero-pause" onClick={toggle} aria-pressed={!playing}>
        {playing ? 'Pausar animação' : 'Retomar animação'}
      </button>
    </section>
  )
}

/* ---------- Recursos: uma noite de call, em ordem ---------- */

const ROWS = [
  {
    title: 'Call com senha e limite',
    text: 'Fecha a call com senha e define quantas pessoas cabem. Squad de 5 é squad de 5.',
    demo: <span className="demo-field"><IconLock width={14} height={14} /> senha definida <b>4 de 5</b></span>,
  },
  {
    title: 'Convites que mudam',
    text: 'Link com validade e limite de usos. Vazou? Gera outro e o antigo para de funcionar na hora.',
    demo: <span className="demo-invite"><code>calls.app/<b>k7Qx2</b></code><code><s>calls.app/p0Lm9</s></code></span>,
  },
  {
    title: 'Cargos com permissões',
    text: 'Cor, ícone e permissão por cargo: quem modera, quem fala, quem só escuta.',
    demo: <span className="demo-roles"><span className="role r1">Dono</span><span className="role r2">Mod</span><span className="role r3">Squad</span></span>,
  },
  {
    title: 'Seu som, seu tema, seu perfil',
    text: 'Som de entrada, pacotes de sons do Callstor, temas extras e avatar e banner animados. Para todo mundo, sem pagar.',
    demo: <span className="demo-wave" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ height: `${25 + ((i * 37) % 70)}%` }} />)}</span>,
  },
  {
    title: 'nome#0000',
    text: 'Usa o nome que quiser. O número no final garante que ninguém confunde você com outra pessoa.',
    demo: <span className="demo-tag" translate="no">felipe<span>#4821</span></span>,
  },
]

function Features() {
  return (
    <section className="section" id="recursos" aria-labelledby="recursos-titulo">
      <div className="wrap">
        <h2 id="recursos-titulo" className="section-title">Monta a call, chama a galera, mostra a jogada.</h2>

        <article className="stream">
          <div className="stream-copy">
            <h3>Transmissão em 1440p60, de graça.</h3>
            <p>
              Escolhe resolução e quadros antes de transmitir. Internet ruim? Desce para 720p e ninguém fica travado.
              Cada pessoa recebe a qualidade que cabe na tela dela.
            </p>
          </div>
          <AppPreview logo={media('calls-logo-256.png')} />
        </article>

        <ul className="rows">
          {ROWS.map((r) => (
            <li className="row" key={r.title}>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
              <div className="row-demo" aria-hidden="true">{r.demo}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Calls+: tabela honesta ---------- */

const COMPARE: [string, string | true, string | true][] = [
  ['Calls de voz com senha e limite', true, true],
  ['Transmissão de tela', '1440p60', '1440p60'],
  ['Avatar e banner animados, temas e sons do Callstor', true, true],
  ['Servidores, canais, cargos e convites', true, true],
  ['Tamanho máximo de upload', '25 MB', '500 MB'],
  ['Replay: salvar os últimos 2 min da call', '', true],
  ['Gravação de calls na nuvem', '', '50 GB'],
  ['Transcrição e resumo das calls', '', '20 h por mês'],
  ['Escolher o número da nametag', '', true],
  ['Perfil diferente em cada servidor', '', true],
  ['Impulsos de servidor inclusos', '', '2 por mês'],
]

function Cell({ v }: { v: string | true }) {
  if (v === true) return <td><IconCheck width={18} height={18} /><span className="sr">Incluso</span></td>
  if (v === '') return <td className="no"><span aria-hidden="true">–</span><span className="sr">Não incluso</span></td>
  return <td>{v}</td>
}

function CallsPlus() {
  return (
    <section className="section" id="calls-plus" aria-labelledby="plus-titulo">
      <div className="wrap plus-grid">
        <div className="plus-copy">
          <h2 id="plus-titulo" className="section-title">O visual é de todo mundo. O Calls+ guarda o resto.</h2>
          <p>
            Nada do que deixa sua call bonita ou nítida é pago. O Calls+ cobre o que custa caro para manter:
            nuvem para gravações e clipes, arquivos grandes e transcrição.
          </p>
          <p className="plus-price"><strong>R$&nbsp;9,90</strong> por mês, ou R$&nbsp;99 por ano. Chega junto com a versão pública.</p>

          <h3>Como o Calls se paga</h3>
          <dl className="funding">
            <div><dt>Impulsos de servidor</dt><dd>A comunidade junta impulsos e libera link personalizado, áudio de alta fidelidade e Palco para eventos.</dd></div>
            <div><dt>Criadores</dt><dd>Assinaturas do servidor, gorjetas por Pix na transmissão e ingressos. O criador fica com até 90%.</dd></div>
            <div><dt>Colecionáveis</dt><dd>Edições limitadas de Natal, Carnaval e parcerias. Opcionais.</dd></div>
          </dl>
        </div>

        <div className="compare-wrap">
          <table className="compare">
            <caption className="sr">Comparação entre o plano grátis e o Calls+</caption>
            <thead>
              <tr>
                <th scope="col"><span className="sr">Recurso</span></th>
                <th scope="col">Grátis</th>
                <th scope="col" className="plus-col">Calls+</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([label, free, plus]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <Cell v={free} />
                  <Cell v={plus} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/* ---------- Dúvidas ---------- */

const FAQ = [
  {
    q: 'O Calls é grátis mesmo?',
    a: <p>Sim. Baixar, criar servidores, entrar em calls, transmitir em 1440p60 e usar perfil animado, temas e sons do Callstor não custam nada e não têm anúncio. O Calls+ é opcional e cobre nuvem, gravação e ferramentas extras.</p>,
  },
  {
    q: 'O Windows mostrou “O Windows protegeu o computador”. É seguro?',
    a: (
      <>
        <p>
          Esse aviso do SmartScreen aparece porque o instalador ainda <strong>não tem assinatura de código</strong>, um certificado pago que estamos providenciando.
          Ele não indica problema no arquivo, só que o Windows ainda não conhece o Calls.
        </p>
        <ol>
          <li>Clique em <strong>Mais informações</strong>.</li>
          <li>Confira se o arquivo é <code>Calls-&lt;versão&gt;-win-x64.exe</code> e se veio deste site ou das releases oficiais no GitHub.</li>
          <li>Clique em <strong>Executar assim mesmo</strong>.</li>
        </ol>
        <p>
          Com o <strong>Controle Inteligente de Aplicativos</strong> (Smart App Control) do Windows 11 ligado, o instalador é bloqueado sem essa opção.
          O mais seguro é esperar a versão assinada. Desligá-lo em <em>Segurança do Windows, Controle de aplicativos e do navegador</em> funciona,
          mas em várias versões do Windows ele só volta a ser ligado reinstalando o sistema.
        </p>
      </>
    ),
  },
  { q: 'Funciona no Mac ou no Linux?', a: <p>Por enquanto só no Windows 10 e 11, 64 bits. macOS e Linux estão no planejamento.</p> },
  { q: 'Como o Calls se atualiza?', a: <p>Sozinho. O launcher confere se há versão nova ao abrir, baixa e instala em segundo plano.</p> },
  { q: 'Meus dados ficam seguros?', a: <p>As senhas são guardadas com hash, a conexão é sempre criptografada (HTTPS e WebRTC com DTLS-SRTP) e o Calls não vende dados nem mostra anúncios.</p> },
  { q: 'Quanto vai custar o Calls+?', a: <p>R$&nbsp;9,90 por mês ou R$&nbsp;99 por ano, com pagamento por Pix ou cartão. O valor final sai junto com o lançamento.</p> },
]

function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-titulo">
      <div className="wrap faq-grid">
        <div className="faq-side">
          <h2 id="faq-titulo" className="section-title">Dúvidas</h2>
          <img src={media('callstor-apontando.webp')} alt="Callstor, o castor do Calls, apontando para as perguntas" width={800} height={800} loading="lazy" />
        </div>
        <div className="faq-list">
          {FAQ.map((f, i) => (
            <details className="faq-item" key={f.q} open={i === 1}>
              <summary>{f.q}</summary>
              <div className="faq-body">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Close() {
  return (
    <section className="close" aria-labelledby="close-titulo">
      <div className="wrap close-inner">
        <img src={media('callstor-cor.webp')} alt="" width={120} height={120} loading="lazy" />
        <h2 id="close-titulo">A call das 21h ainda tem vaga.</h2>
        <DownloadButton showMeta={false} />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="brand">
          <img src={media('logo-callstor.webp')} alt="" width={32} height={32} />
          <span translate="no">Calls Comunicações</span>
        </div>
        <nav aria-label="Rodapé">
          <a href="https://github.com/Calls-Comunicacoes/calls-releases/releases" target="_blank" rel="noreferrer">Todas as versões</a>
          <a href="#faq">Dúvidas</a>
          <a href="https://github.com/Calls-Comunicacoes" target="_blank" rel="noreferrer"><IconGithub width={16} height={16} /> GitHub</a>
        </nav>
        <div className="footer-bottom">
          <p className="fine">© {new Date().getFullYear()} Calls Comunicações. Feito no Brasil, com um castor de headset.</p>
          <a className="made-by" href="https://fbrdev.com.br" target="_blank" rel="noopener" aria-label="Desenvolvido por FBR.Dev (abre em nova aba)">
            <span>Desenvolvido por</span>
            <img src={media('fbrdev-branco.webp')} alt="FBR.Dev" width={320} height={155} loading="lazy" />
          </a>
        </div>
      </div>
    </footer>
  )
}

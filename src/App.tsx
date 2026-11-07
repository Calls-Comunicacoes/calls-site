import { useEffect, useRef } from 'react'
import { DownloadButton } from './components/DownloadButton'
import { AppPreview } from './components/AppPreview'
import {
  IconArrow, IconCheck, IconGithub, IconInvite, IconLock, IconRoles, IconScreen, IconSound, IconSparkle, IconTag,
} from './components/Icons'

const media = (f: string) => `${import.meta.env.BASE_URL}media/${f}`

export function App() {
  return (
    <>
      <div className="bg-glow" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Features />
        <Preview />
        <CallsPlus />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#topo" className="brand">
          <img src={media('calls-logo-256.png')} alt="" width={32} height={32} />
          <span>Calls</span>
        </a>
        <nav className="nav-links" aria-label="Seções">
          <a href="#recursos">Recursos</a>
          <a href="#previa">Prévia</a>
          <a href="#calls-plus">Calls+</a>
          <a href="#faq">Dúvidas</a>
        </nav>
        <a href="#baixar" className="btn btn-md btn-ghost-strong nav-cta">Baixar</a>
      </div>
    </header>
  )
}

function Hero() {
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    // Movimento reduzido: fica só o quadro estático do Callstor.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.current?.pause()
  }, [])
  return (
    <section className="hero" id="topo">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="chip chip-amber"><span className="dot" /> Grátis para sempre · Windows</span>
          <h1>
            Sua turma, a <em>uma call</em> de distância.
          </h1>
          <p className="lead">
            O Calls junta voz, transmissão de tela e chat num app leve e brasileiro. Crie uma call com senha,
            chame a galera com um convite e jogue junto, sem pagar nada.
          </p>
          <div className="hero-actions" id="baixar">
            <DownloadButton />
            <a href="#recursos" className="btn btn-lg btn-secondary">Ver recursos <IconArrow /></a>
          </div>
        </div>

        <div className="hero-stage" aria-hidden="true">
          <div className="stage-photo layer">
            <img src={media('callstor-setup.webp')} alt="" width={1600} height={894} />
          </div>
          <div className="stage-loader layer">
            <video
              ref={video}
              src={media('callstor-loading.webm')}
              poster={media('callstor-cor.webp')}
              autoPlay loop muted playsInline
            />
            <div className="stage-loader-text">
              <strong>Callstor está te conectando…</strong>
              <span className="bar"><i /></span>
            </div>
          </div>
          <div className="float-card fc-live layer">
            <span className="live">AO VIVO</span>
            <div>
              <strong>Ranqueada das 21h</strong>
              <small>1440p · 60 fps</small>
            </div>
          </div>
          <div className="float-card fc-join layer">
            <span className="avatar a2">M</span>
            <div>
              <strong>mari<span className="tag">#2048</span></strong>
              <small>entrou na call</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  {
    icon: <IconLock />, title: 'Calls com senha e limite',
    text: 'Feche a call com senha e defina quantas pessoas cabem. Squad de 5 é squad de 5.',
    demo: <div className="demo-row"><span className="mini-pill"><IconLock width={14} height={14} /> ••••••</span><span className="mini-pill amber">4/5</span></div>,
  },
  {
    icon: <IconScreen />, title: 'Transmissão de tela no controle',
    text: 'Escolha resolução e fps antes de transmitir: 720p para economizar, 1080p60 para mostrar a jogada.',
    demo: <div className="demo-row seg"><span>720p</span><span className="on">1080p</span><span>60 fps</span></div>,
  },
  {
    icon: <IconRoles />, title: 'Cargos do seu jeito',
    text: 'Crie cargos com cor, ícone e permissões finas. Quem modera, quem fala, quem só escuta.',
    demo: <div className="demo-row"><span className="role r1">Dono</span><span className="role r2">Mod</span><span className="role r3">Squad</span></div>,
  },
  {
    icon: <IconInvite />, title: 'Convites que mudam',
    text: 'Links que expiram, com limite de usos, e que você troca quando quiser. Convite vazado? Gira e pronto.',
    demo: <div className="demo-row"><code className="invite">calls.app/<b>k7Qx2</b></code><span className="mini-pill">24h</span></div>,
  },
  {
    icon: <IconSound />, title: 'Sons personalizados',
    text: 'Seu som de entrada, de saída e de notificação. Todo mundo sabe que você chegou.',
    demo: <div className="demo-row wave" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ height: `${20 + ((i * 37) % 70)}%` }} />)}</div>,
  },
  {
    icon: <IconTag />, title: 'nametag#0000',
    text: 'Use o nome que quiser: o número no final garante que ninguém confunda você com outra pessoa.',
    demo: <div className="demo-row"><span className="nametag">felipe<span>#4821</span></span></div>,
  },
]

function Features() {
  return (
    <section className="section" id="recursos">
      <div className="wrap">
        <header className="section-head">
          <span className="eyebrow">Recursos</span>
          <h2>Tudo que a sua call precisa. Nada que atrapalhe.</h2>
        </header>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <article className="feature card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <div className="feature-demo">{f.demo}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Preview() {
  return (
    <section className="section section-preview" id="previa">
      <div className="wrap">
        <header className="section-head">
          <span className="eyebrow">Prévia</span>
          <h2>Feito para passar a noite na call.</h2>
          <p className="section-sub">Tema escuro confortável, call em destaque e o chat sempre à mão.</p>
        </header>
        <AppPreview logo={media('calls-logo-256.png')} />
      </div>
    </section>
  )
}

const FREE = [
  'Calls de voz ilimitadas, com senha e limite',
  'Transmissão de tela até 1080p30',
  'Servidores, canais, cargos e convites',
  'Sons personalizados básicos',
  'Uploads de até 25 MB',
]
const PLUS = [
  'Avatar e banner animados',
  'Temas e ícones extras do app',
  'Pacotes de sons premium do Callstor',
  'Transmissão em 1440p60',
  'Uploads de até 500 MB',
  'Escolha o número da sua nametag',
  '2 impulsos de servidor por mês',
]

function CallsPlus() {
  return (
    <section className="section" id="calls-plus">
      <div className="wrap">
        <header className="section-head">
          <span className="eyebrow eyebrow-amber">Calls+</span>
          <h2>O Calls é grátis. O Calls+ é para quem quer brilhar.</h2>
          <p className="section-sub">
            Nada essencial fica atrás de pagamento. O Calls+ traz visual, sons e qualidade extra, e ajuda a manter os servidores no ar.
          </p>
        </header>

        <div className="plans">
          <article className="plan card">
            <h3>Grátis</h3>
            <p className="price"><strong>R$ 0</strong><span>para sempre</span></p>
            <ul>{FREE.map((t) => <li key={t}><IconCheck />{t}</li>)}</ul>
            <a href="#baixar" className="btn btn-md btn-secondary">Baixar o Calls</a>
          </article>

          <article className="plan plan-plus card">
            <span className="plan-badge">Em breve</span>
            <img className="plan-mascot" src={media('callstor-cor.webp')} alt="" width={140} height={140} />
            <h3><IconSparkle /> Calls+</h3>
            <p className="price"><strong>R$ 9,90</strong><span>/mês · ou R$ 99/ano</span></p>
            <ul>
              <li className="li-strong"><IconCheck />Tudo do plano grátis, e mais:</li>
              {PLUS.map((t) => <li key={t}><IconCheck />{t}</li>)}
            </ul>
            <span className="btn btn-md btn-accent" aria-disabled="true">Chega junto com a versão pública</span>
          </article>

          <div className="plan-extras">
            <article className="extra card">
              <h4>Impulsos de servidor</h4>
              <p>A comunidade junta impulsos e libera áudio melhor, 1440p60 para todos e banner animado do servidor.</p>
            </article>
            <article className="extra card">
              <h4>Loja do Callstor</h4>
              <p>Molduras, efeitos de perfil, figurinhas e pacotes de sons temáticos, comprados uma vez e seus para sempre.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

const FAQ = [
  {
    q: 'O Calls é grátis mesmo?',
    a: <>Sim. Baixar, criar servidores, entrar em calls e transmitir a tela não custam nada e não têm anúncio. O Calls+ (em breve) é opcional e só traz extras visuais e de qualidade.</>,
  },
  {
    q: 'O Windows mostrou "O Windows protegeu o computador". É seguro?',
    a: (
      <>
        <p>
          Esse aviso do SmartScreen aparece porque o instalador do Calls ainda <strong>não tem assinatura de código</strong> (um certificado pago que estamos providenciando).
          Não significa que haja algo errado com o arquivo, só que o Windows ainda não conhece o Calls.
        </p>
        <ol>
          <li>Clique em <strong>Mais informações</strong>.</li>
          <li>Confira se o editor/arquivo é <code>Calls-&lt;versão&gt;-win-x64.exe</code>, baixado deste site ou das releases oficiais no GitHub.</li>
          <li>Clique em <strong>Executar assim mesmo</strong>.</li>
        </ol>
        <p>
          Se o <strong>Controle Inteligente de Aplicativos</strong> (Smart App Control) do Windows 11 estiver ativo, ele bloqueia apps não assinados sem dar a opção acima.
          Nesse caso, o mais seguro é esperar a versão assinada, que já está a caminho. Desativá-lo (em <em>Segurança do Windows → Controle de aplicativos e do navegador</em>) funciona,
          mas em várias versões do Windows ele só pode ser religado reinstalando o sistema, então pense bem antes.
        </p>
      </>
    ),
  },
  {
    q: 'Funciona no Mac ou no Linux?',
    a: <>Por enquanto só Windows 10 e 11 (64 bits). macOS e Linux estão no planejamento.</>,
  },
  {
    q: 'Como o Calls se atualiza?',
    a: <>Sozinho. O launcher confere se há versão nova ao abrir, baixa e instala em segundo plano.</>,
  },
  {
    q: 'Meus dados ficam seguros?',
    a: <>As senhas são guardadas com hash, a conexão é sempre criptografada (HTTPS/TLS e WebRTC com DTLS-SRTP) e o Calls não vende dados nem mostra anúncios.</>,
  },
  {
    q: 'Quanto vai custar o Calls+?',
    a: <>A ideia é R$ 9,90 por mês ou R$ 99 por ano, com pagamento por Pix ou cartão. O valor final sai junto com o lançamento.</>,
  },
]

function Faq() {
  return (
    <section className="section" id="faq">
      <div className="wrap faq-wrap">
        <header className="section-head left">
          <span className="eyebrow">Dúvidas</span>
          <h2>Perguntas frequentes</h2>
          <img className="faq-mascot" src={media('callstor-apontando.webp')} alt="Callstor, o castor mascote do Calls, apontando" width={800} height={800} loading="lazy" />
        </header>
        <div className="faq-list">
          {FAQ.map((f, i) => (
            <details className="faq-item card" key={f.q} open={i === 1}>
              <summary>{f.q}</summary>
              <div className="faq-body">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="final card">
          <img src={media('callstor-cor.webp')} alt="" width={160} height={160} loading="lazy" />
          <div>
            <h2>Bora pra call?</h2>
            <p>Baixe o Calls, crie seu servidor e mande o convite para a galera.</p>
          </div>
          <DownloadButton showMeta={false} />
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="brand">
          <img src={media('calls-logo-256.png')} alt="" width={28} height={28} />
          <span>Calls Comunicações</span>
        </div>
        <nav aria-label="Rodapé">
          <a href="https://github.com/Calls-Comunicacoes/calls-releases/releases" target="_blank" rel="noreferrer">Todas as versões</a>
          <a href="#faq">Dúvidas</a>
          <a href="https://github.com/Calls-Comunicacoes" target="_blank" rel="noreferrer"><IconGithub width={16} height={16} /> GitHub</a>
        </nav>
        <p className="fine">© {new Date().getFullYear()} Calls Comunicações. Feito no Brasil, com um castor de headset.</p>
      </div>
    </footer>
  )
}

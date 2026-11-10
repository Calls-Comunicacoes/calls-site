import { useEffect, useRef, useState } from 'react'

const media = (f: string) => `${import.meta.env.BASE_URL}media/${f}`

const SHOTS = [
  {
    id: 'amigos',
    tab: 'Amigos',
    title: 'Quem está on, quem está em call.',
    text: 'A tela inicial mostra quem está disponível e quem já está numa call. Seu código nome#0000 fica sempre à mão para passar para a galera.',
    src: 'telas/app-amigos.webp',
    alt: 'Tela real de Amigos do Calls: amigos em call, disponíveis e o código rafa#2048 no topo.',
  },
  {
    id: 'perfil',
    tab: 'Perfil',
    title: 'Seu perfil, do seu jeito.',
    text: 'Nome, nametag, recado, pronomes, banner com estilo e cor. A prévia ao lado mostra como os outros vão te ver.',
    src: 'telas/app-perfil.webp',
    alt: 'Tela real de perfil do Calls com campos de nome, nametag, recado, pronomes, estilos de banner e a prévia do cartão.',
  },
  {
    id: 'entrar',
    tab: 'Entrar',
    title: 'O Callstor te recebe.',
    text: 'Entrar com Google ou e-mail, com o castor acenando do setup. É a primeira coisa que você vê ao abrir o Calls.',
    src: 'telas/app-entrar.webp',
    alt: 'Tela real de entrada do Calls com o Callstor no setup gamer e o formulário de login.',
  },
]

/** Por dentro do app: prints reais + as animações do Callstor que aparecem no Calls. */
export function Inside() {
  const [active, setActive] = useState(SHOTS[0].id)
  const shot = SHOTS.find((s) => s.id === active)!
  const loader = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) loader.current?.pause()
  }, [])

  return (
    <section className="section inside" id="por-dentro" aria-labelledby="dentro-titulo">
      <div className="wrap">
        <h2 id="dentro-titulo" className="section-title">Por dentro do Calls.</h2>

        <div className="inside-grid">
          <div className="inside-copy">
            <div className="inside-tabs" role="tablist" aria-label="Telas do app">
              {SHOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={active === s.id}
                  aria-controls="inside-panel"
                  className={active === s.id ? 'on' : ''}
                  onClick={() => setActive(s.id)}
                >
                  {s.tab}
                </button>
              ))}
            </div>
            <h3>{shot.title}</h3>
            <p>{shot.text}</p>

            <figure className="mascot-card">
              <div className="mascot-stage">
                <video
                  ref={loader}
                  src={media('callstor-loading.webm')}
                  poster={media('callstor-cor.webp')}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden="true"
                />
              </div>
              <figcaption>
                <strong>Callstor carregando o app</strong>
                <span>A animação que roda enquanto o Calls conecta, e que volta se a internet cair.</span>
              </figcaption>
            </figure>
          </div>

          <figure className="shot shot-tab" id="inside-panel" role="tabpanel" aria-labelledby={`tab-${shot.id}`}>
            <img key={shot.id} src={media(shot.src)} alt={shot.alt} width={2400} height={1350} loading="lazy" />
          </figure>
        </div>
      </div>
    </section>
  )
}

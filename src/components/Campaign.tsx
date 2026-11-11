import { useEffect, useState } from 'react'
import { APOIASE_URL } from '../config'
import { getApi } from '../api'
import { SupportDialog } from './SupportDialog'

export type Kind = 'mensal' | 'avulso'

export interface Tier {
  id: string
  name: string
  price: number
  summary: string
  perks: string[]
  recommended?: boolean
  shipping?: boolean
}

/** Mesmos níveis da página do Apoia.se (apoia.se/app-calls). */
export const TIERS: Tier[] = [
  {
    id: 'raiz',
    name: 'Apoiador Raiz',
    price: 15,
    summary: 'Seu nome no mural de apoiadores do site e acesso antecipado ao beta.',
    perks: ['Nome no mural do site', 'Acesso antecipado (beta)', 'Acompanhe o desenvolvimento de perto'],
  },
  {
    id: 'fundador',
    name: 'Selo de Fundador',
    price: 35,
    summary: 'Tudo do Raiz e o selo exclusivo de Apoiador Fundador no seu perfil do app.',
    perks: ['Tudo do Apoiador Raiz', 'Selo de Apoiador Fundador no perfil'],
    recommended: true,
  },
  {
    id: 'socio',
    name: 'Sócio Fundador',
    price: 50,
    summary: 'Cores de chat e temas exclusivos de apoiador, e voto nas próximas funções.',
    perks: ['Tudo dos níveis anteriores', 'Cores de chat e temas exclusivos', 'Canal direto para votar em funções'],
  },
  {
    id: 'visionario',
    name: 'Apoiador Visionário',
    price: 150,
    summary: 'Seu nome nos créditos do app (tela Sobre), selo Visionário e suporte prioritário.',
    perks: ['Tudo dos níveis anteriores', 'Nome nos créditos do app', 'Selo de Apoiador Visionário', 'Suporte prioritário com a equipe'],
  },
  {
    id: 'parceiro',
    name: 'Parceiro Oficial',
    price: 1500,
    summary: 'Sua marca em destaque no site, nome de usuário VIP e o kit físico: boné e miniatura 3D do Callstor.',
    perks: [
      'Marca ou nome em destaque na página principal',
      'Reserva de nome de usuário VIP',
      'Linha direta com os desenvolvedores',
      'Boné oficial FBR.Dev + miniatura 3D do Callstor em casa',
    ],
    shipping: true,
  },
]

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

interface WallEntry { public_name: string; tier_id: string; tier_name: string; since: string }

/** Apoio pelo próprio site (Mercado Pago), com mural de apoiadores. */
export function Campaign() {
  const [kind, setKind] = useState<Kind>('mensal')
  const [chosen, setChosen] = useState<Tier | null>(null)
  const [wall, setWall] = useState<WallEntry[] | null>(null)
  const [thanks, setThanks] = useState(false)

  useEffect(() => {
    // Voltou do Mercado Pago: ?apoio=<id>
    const params = new URLSearchParams(location.search)
    if (params.has('apoio')) setThanks(true)
    // Voltou do login no meio de um apoio: reabre o nível que a pessoa escolheu
    const again = TIERS.find((t) => t.id === params.get('apoiar'))
    if (again) {
      const k = params.get('tipo') === 'avulso' ? 'avulso' : 'mensal'
      setKind(k)
      setChosen(again)
      document.getElementById('apoie')?.scrollIntoView()
    }
    if (params.has('apoio') || params.has('apoiar')) history.replaceState(null, '', location.pathname + location.hash)
    void getApi()
      .then((sb) => sb.rpc('supporter_wall'))
      .then(({ data }) => setWall((data as WallEntry[] | null) ?? []))
      .catch(() => setWall([]))
  }, [])

  return (
    <section className="section campaign" id="apoie" aria-labelledby="apoie-titulo">
      <div className="wrap">
        <div className="campaign-head">
          <div>
            <h2 id="apoie-titulo" className="section-title">Apoie o Calls.</h2>
            <p>
              O Calls é 100% brasileiro e independente: hospedagem, VPS, domínios e banco de dados saem do nosso bolso.
              Seu apoio mantém essa infraestrutura no ar e o app grátis para todo mundo.
            </p>
          </div>
          <div className="kind-switch" role="radiogroup" aria-label="Tipo de apoio">
            <button type="button" role="radio" aria-checked={kind === 'mensal'} className={kind === 'mensal' ? 'on' : ''} onClick={() => setKind('mensal')}>
              Todo mês
            </button>
            <button type="button" role="radio" aria-checked={kind === 'avulso'} className={kind === 'avulso' ? 'on' : ''} onClick={() => setKind('avulso')}>
              Uma vez
            </button>
          </div>
        </div>

        {thanks ? (
          <p className="support-thanks" role="status">
            Valeu demais pelo apoio! Assim que o Mercado Pago confirmar o pagamento, seu nível aparece no seu perfil e, se você quis, no mural.
          </p>
        ) : null}

        <ul className="tier-grid">
          {TIERS.map((t) => (
            <li key={t.id} className={`tier-card${t.recommended ? ' is-recommended' : ''}`}>
              {t.recommended ? <span className="tier-flag">Mais escolhido</span> : null}
              <h3>{t.name}</h3>
              <p className="tier-price">
                <strong>{brl(t.price)}</strong>
                <span>{kind === 'mensal' ? 'por mês' : 'uma vez'}</span>
              </p>
              <p className="tier-summary">{t.summary}</p>
              <ul className="tier-perks">
                {t.perks.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <button type="button" className={`btn btn-md ${t.recommended ? 'btn-primary' : 'btn-outline'}`} onClick={() => setChosen(t)}>
                Apoiar com {brl(t.price)}
              </button>
            </li>
          ))}
        </ul>

        <p className="support-note">
          Pagamento seguro pelo Mercado Pago: Pix, cartão ou boleto no apoio de uma vez; cartão no apoio mensal (cancele quando quiser).
          Prefere outra plataforma? <a href={APOIASE_URL} target="_blank" rel="noopener">Apoie pelo Apoia.se</a>.
        </p>

        <div className="wall" aria-labelledby="mural-titulo">
          <h3 id="mural-titulo">Mural de apoiadores</h3>
          {wall === null ? (
            <p className="wall-empty">Carregando…</p>
          ) : wall.length === 0 ? (
            <p className="wall-empty">Ninguém ainda. Seu nome pode ser o primeiro daqui.</p>
          ) : (
            <ul className="wall-list">
              {wall.map((w) => (
                <li key={`${w.public_name}-${w.since}`} className={`wall-item t-${w.tier_id}`}>
                  <strong translate="no">{w.public_name}</strong>
                  <span>{w.tier_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {chosen ? <SupportDialog tier={chosen} kind={kind} onClose={() => setChosen(null)} /> : null}
    </section>
  )
}

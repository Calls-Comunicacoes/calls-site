import { CAMPAIGN_URL } from '../config'

const GOALS = [
  {
    title: 'Manter os servidores ligados',
    text: 'Servidor de voz, banco de dados e domínio. É o que deixa as calls de graça para todo mundo.',
  },
  {
    title: 'Assinar o instalador',
    text: 'Certificado de assinatura de código: acaba com o aviso “O Windows protegeu o computador” na hora de instalar.',
  },
  {
    title: 'Calls no macOS e no Linux',
    text: 'Levar o app para quem não usa Windows, com a mesma qualidade de voz e de tela.',
  },
]

const TIERS = [
  { name: 'Apoiador', price: 'R$ 5', reward: 'Selo de Apoiador no perfil e seu nome nos créditos do app.' },
  { name: 'Fundador', price: 'R$ 15', reward: 'Selo de Apoiador Fundador, que nunca mais volta a ser vendido, e acesso antecipado às novidades.' },
  { name: 'Patrocinador', price: 'R$ 50', reward: 'Tudo acima, um pacote de sons exclusivo do Callstor e voto nas próximas funções.' },
]

/** Campanha de apoio financeiro (Apoia.se ou Catarse). O link fica em src/config.ts. */
export function Campaign() {
  const ready = CAMPAIGN_URL !== ''
  return (
    <section className="section campaign" id="apoie" aria-labelledby="apoie-titulo">
      <div className="wrap campaign-grid">
        <div className="campaign-copy">
          <h2 id="apoie-titulo" className="section-title">O Calls é independente. Dá uma força?</h2>
          <p>
            Não tem investidor nem anúncio. Quem paga o servidor das calls é a comunidade.
            Com um apoio mensal você mantém o Calls grátis e ajuda a decidir o que vem depois.
          </p>
          <ol className="goals">
            {GOALS.map((g) => (
              <li key={g.title}>
                <h3>{g.title}</h3>
                <p>{g.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="tiers">
          {TIERS.map((t) => (
            <article className="tier" key={t.name}>
              <div className="tier-head">
                <h3>{t.name}</h3>
                <p><strong>{t.price}</strong> por mês</p>
              </div>
              <p>{t.reward}</p>
            </article>
          ))}
          {ready ? (
            <a className="btn btn-lg btn-primary tier-cta" href={CAMPAIGN_URL} target="_blank" rel="noopener">
              Apoiar o Calls
            </a>
          ) : (
            <p className="tier-soon">
              <span className="btn btn-lg btn-soon">Campanha abre em breve</span>
              <span>A página da campanha está sendo montada.</span>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

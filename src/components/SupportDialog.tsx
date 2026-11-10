import { useEffect, useRef, useState, type FormEvent } from 'react'
import { APP_URL } from '../config'
import { getSupabase } from '../supabase'
import type { Kind, Tier } from './Campaign'

const UFS = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ')
const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

type Phase = { s: 'checking' } | { s: 'login' } | { s: 'form'; email: string; name: string } | { s: 'sending' } | { s: 'error'; msg: string; email: string; name: string }

/** Confirma o apoio e leva para o pagamento no Mercado Pago. */
export function SupportDialog({ tier, kind, onClose }: { tier: Tier; kind: Kind; onClose(): void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [phase, setPhase] = useState<Phase>({ s: 'checking' })
  const [showInWall, setShowInWall] = useState(true)
  const [cep, setCep] = useState('')
  const [addr, setAddr] = useState({ street: '', district: '', city: '', state: '' })

  useEffect(() => {
    ref.current?.showModal()
    void getSupabase()
      .then((sb) => sb.auth.getSession())
      .then(({ data }) => {
        const u = data.session?.user
        if (!u) return setPhase({ s: 'login' })
        const meta = u.user_metadata as { first_name?: string; full_name?: string } | undefined
        setPhase({ s: 'form', email: u.email ?? '', name: meta?.full_name ?? meta?.first_name ?? '' })
      })
      .catch(() => setPhase({ s: 'error', msg: 'Sem conexão com o servidor do Calls. Tente de novo.', email: '', name: '' }))
  }, [])

  // Preenche o endereço pelo CEP (ViaCEP): menos digitação, menos erro.
  async function lookupCep(value: string) {
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 8) return
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const d = (await r.json()) as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string }
      if (!d.erro) setAddr({ street: d.logradouro ?? '', district: d.bairro ?? '', city: d.localidade ?? '', state: d.uf ?? '' })
    } catch {
      /* segue com digitação manual */
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (phase.s !== 'form' && phase.s !== 'error') return
    const prev = { email: phase.email, name: phase.name }
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const body = {
      tier: tier.id,
      kind,
      showInWall,
      publicName: showInWall ? get('publicName') : undefined,
      payerEmail: kind === 'mensal' ? get('payerEmail') : undefined,
      shipping: tier.shipping
        ? {
            full_name: get('full_name'), phone: get('phone'), cep: get('cep'), street: get('street'), number: get('number'),
            complement: get('complement'), district: get('district'), city: get('city'), state: get('state'),
          }
        : undefined,
    }
    setPhase({ s: 'sending' })
    try {
      const sb = await getSupabase()
      const { data, error } = await sb.functions.invoke('apoio-checkout', { body })
      if (error) {
        // a função responde { error } com a mensagem em português
        const ctx = (error as { context?: Response }).context
        const msg = ctx ? ((await ctx.json().catch(() => ({}))) as { error?: string }).error : undefined
        throw new Error(msg ?? 'Não foi possível iniciar o pagamento. Tente de novo.')
      }
      window.location.assign((data as { url: string }).url)
    } catch (err) {
      setPhase({ s: 'error', msg: (err as Error).message, ...prev })
    }
  }

  const title = `${tier.name} · ${brl(tier.price)}${kind === 'mensal' ? ' por mês' : ''}`

  return (
    <dialog ref={ref} className="support-dialog" aria-labelledby="sd-title" onClose={onClose} onCancel={onClose}>
      <header>
        <h2 id="sd-title">{title}</h2>
        <button type="button" className="sd-close" aria-label="Fechar" onClick={() => ref.current?.close()}>×</button>
      </header>

      {phase.s === 'checking' ? <p className="sd-muted">Conferindo sua conta…</p> : null}

      {phase.s === 'login' ? (
        <div className="sd-login">
          <p>Para o apoio entrar no seu perfil do Calls (selos, temas, créditos), entre na sua conta antes. Leva 1 minuto para criar.</p>
          <a className="btn btn-md btn-primary" href={`${APP_URL}?voltar=apoie`}>Entrar ou criar conta</a>
          <p className="sd-muted">Depois de entrar, volte aqui no site e clique em apoiar de novo.</p>
        </div>
      ) : null}

      {phase.s === 'form' || phase.s === 'error' || phase.s === 'sending' ? (
        <form className="sd-form" onSubmit={submit}>
          <fieldset disabled={phase.s === 'sending'}>
            <label className="sd-check">
              <input type="checkbox" checked={showInWall} onChange={(e) => setShowInWall(e.target.checked)} />
              Quero aparecer no mural de apoiadores
            </label>
            {showInWall ? (
              <label>
                Nome no mural
                <input name="publicName" required minLength={2} maxLength={40} defaultValue={phase.s !== 'sending' ? phase.name : ''} autoComplete="nickname" />
              </label>
            ) : null}

            {kind === 'mensal' ? (
              <label>
                E-mail da sua conta do Mercado Pago
                <input name="payerEmail" type="email" required defaultValue={phase.s !== 'sending' ? phase.email : ''} autoComplete="email" spellCheck={false} />
                <small>O Mercado Pago só aceita a assinatura com o mesmo e-mail da conta que vai pagar.</small>
              </label>
            ) : null}

            {tier.shipping ? (
              <div className="sd-ship">
                <p className="sd-ship-title">Endereço para o boné e a miniatura</p>
                <label className="span2">Quem recebe<input name="full_name" required minLength={3} maxLength={80} autoComplete="name" /></label>
                <label>Telefone<input name="phone" type="tel" required pattern="\+?[0-9 ()\-]{10,20}" placeholder="(62) 99999-0000" autoComplete="tel" /></label>
                <label>CEP<input name="cep" required pattern="[0-9]{5}-?[0-9]{3}" inputMode="numeric" placeholder="74000-000" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={(e) => void lookupCep(e.target.value)} autoComplete="postal-code" /></label>
                <label className="span2">Rua<input name="street" required value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} autoComplete="address-line1" /></label>
                <label>Número<input name="number" required maxLength={12} /></label>
                <label>Complemento<input name="complement" maxLength={60} autoComplete="address-line2" /></label>
                <label>Bairro<input name="district" required value={addr.district} onChange={(e) => setAddr({ ...addr, district: e.target.value })} /></label>
                <label>Cidade<input name="city" required value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} autoComplete="address-level2" /></label>
                <label>Estado
                  <select name="state" required value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })}>
                    <option value="" disabled>UF</option>
                    {UFS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </label>
              </div>
            ) : null}

            {phase.s === 'error' ? <p className="sd-error" role="alert">{phase.msg}</p> : null}

            <button type="submit" className="btn btn-lg btn-primary sd-submit" aria-busy={phase.s === 'sending'}>
              {phase.s === 'sending' ? 'Abrindo o Mercado Pago…' : `Ir para o pagamento (${brl(tier.price)})`}
            </button>
            <p className="sd-muted">
              {kind === 'mensal'
                ? 'Cobrança mensal no cartão pelo Mercado Pago. Você cancela quando quiser na sua conta do Mercado Pago.'
                : 'Pagamento único por Pix, cartão ou boleto no Mercado Pago.'}
            </p>
          </fieldset>
        </form>
      ) : null}
    </dialog>
  )
}

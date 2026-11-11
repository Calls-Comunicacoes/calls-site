import { useEffect, useRef, useState } from 'react'
import { APP_URL, API_URL } from '../config'
import { getApi } from '../api'

interface Me { id: string; name: string; handle: string | null }

/** Chave onde o supabase-js guarda a sessão (mesma do app web, mesmo domínio). */
const SESSION_KEY = `sb-${new URL(API_URL).hostname.split('.')[0]}-auth-token`

/** Link de login que volta para o site depois de entrar. */
export const loginUrl = (back = '/') => `${APP_URL}?voltar=${encodeURIComponent(back)}`

/** "Entrar" quando deslogado; perfil (foto + nome) quando logado. */
export function AccountButton() {
  const [me, setMe] = useState<Me | null>(null)
  const [open, setOpen] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Só carrega o cliente da API se existe sessão guardada (não pesa a página de quem nunca entrou).
    let has = false
    try { has = Boolean(localStorage.getItem(SESSION_KEY)) } catch { /* sem storage */ }
    if (!has) return
    void getApi().then(async (sb) => {
      const { data } = await sb.auth.getSession()
      const u = data.session?.user
      if (!u) return
      const meta = u.user_metadata as { first_name?: string; full_name?: string }
      const { data: card } = await sb.from('profile_cards').select('first_name, handle').eq('id', u.id).maybeSingle()
      setMe({ id: u.id, name: card?.first_name ?? meta.first_name ?? meta.full_name ?? 'Você', handle: card?.handle ?? null })
    })
  }, [])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [open])

  if (!me) return <a href={loginUrl('/')} className="btn btn-sm btn-outline nav-cta">Entrar</a>

  async function signOut() {
    const sb = await getApi()
    await sb.auth.signOut()
    setMe(null)
    setOpen(false)
  }

  const avatar = `${API_URL}/storage/v1/object/public/avatars/${me.id}/avatar.webp`
  return (
    <div className="account nav-cta" ref={box}>
      <button type="button" className="account-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        {imgOk ? (
          <img src={avatar} alt="" width={30} height={30} onError={() => setImgOk(false)} />
        ) : (
          <span className="account-initial" aria-hidden="true">{me.name.slice(0, 1).toUpperCase()}</span>
        )}
        <span className="account-name" translate="no">{me.name}</span>
      </button>
      {open ? (
        <div className="account-menu" role="menu">
          {me.handle ? <p className="account-handle" translate="no">{me.handle}</p> : null}
          <a role="menuitem" href={APP_URL}>Abrir o Calls no navegador</a>
          <a role="menuitem" href="#apoie" onClick={() => setOpen(false)}>Apoiar o Calls</a>
          <button role="menuitem" type="button" onClick={() => void signOut()}>Sair</button>
        </div>
      ) : null}
    </div>
  )
}

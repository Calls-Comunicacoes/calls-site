import type { SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './config'

let client: Promise<SupabaseClient> | null = null

/**
 * Cliente do Supabase carregado só quando precisa (apoio e mural), para não pesar a página.
 * Mesmo domínio do app web (/app/): quem entrou lá já está logado aqui.
 */
export function getSupabase(): Promise<SupabaseClient> {
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    }),
  )
  return client
}

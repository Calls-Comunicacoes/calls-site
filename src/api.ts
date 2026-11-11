import type { SupabaseClient } from '@supabase/supabase-js'
import { API_KEY, API_URL } from './config'

let client: Promise<SupabaseClient<any, 'calls'>> | null = null

/**
 * Cliente da API do Calls carregado só quando precisa (apoio e mural), para não pesar a página.
 * Mesmo domínio do app web (/app/): quem entrou lá já está logado aqui.
 */
export function getApi(): Promise<SupabaseClient<any, 'calls'>> {
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(API_URL, API_KEY, {
      db: { schema: 'calls' },
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    }),
  )
  return client
}

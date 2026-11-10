import { useEffect, useState } from 'react'
import { DOWNLOAD_ENABLED } from './config'

export const RELEASES_REPO = 'Calls-Comunicacoes/calls-releases'
export const RELEASES_URL = `https://github.com/${RELEASES_REPO}/releases/latest`
const API_URL = `https://api.github.com/repos/${RELEASES_REPO}/releases/latest`
const ASSET_RE = /^Calls-(.+)-win-x64\.exe$/i

export type Release =
  | { state: 'loading' }
  | { state: 'ready'; version: string; url: string; sizeMb: number | null; date: string }
  | { state: 'soon' } // nenhuma release publicada ainda
  | { state: 'error' } // API indisponível: cai no link /releases/latest

interface GhAsset { name: string; browser_download_url: string; size: number }
interface GhRelease { tag_name: string; published_at: string; assets: GhAsset[] }

let cache: Promise<Release> | null = null

function fetchRelease(): Promise<Release> {
  cache ??= fetch(API_URL, { headers: { Accept: 'application/vnd.github+json' } })
    .then(async (res): Promise<Release> => {
      if (res.status === 404) return { state: 'soon' }
      if (!res.ok) return { state: 'error' }
      const data = (await res.json()) as GhRelease
      const asset = data.assets.find((a) => ASSET_RE.test(a.name))
      if (!asset) return { state: 'soon' }
      return {
        state: 'ready',
        version: asset.name.match(ASSET_RE)![1],
        url: asset.browser_download_url,
        sizeMb: asset.size ? Math.round(asset.size / 1024 / 1024) : null,
        date: new Date(data.published_at).toLocaleDateString('pt-BR'),
      }
    })
    .catch((): Release => ({ state: 'error' }))
  return cache
}

export function useLatestRelease(): Release {
  const [release, setRelease] = useState<Release>({ state: DOWNLOAD_ENABLED ? 'loading' : 'soon' })
  useEffect(() => {
    if (!DOWNLOAD_ENABLED) return
    let alive = true
    fetchRelease().then((r) => alive && setRelease(r))
    return () => { alive = false }
  }, [])
  return release
}

import { RELEASES_URL, useLatestRelease } from '../release'
import { IconWindows } from './Icons'

export function DownloadButton({ size = 'lg', showMeta = true }: { size?: 'md' | 'lg'; showMeta?: boolean }) {
  const r = useLatestRelease()

  if (r.state === 'soon') {
    return (
      <div className="dl">
        <span className={`btn btn-${size} btn-soon`} aria-disabled="true">
          <IconWindows /> Em breve para Windows
        </span>
        {showMeta && (
          <p className="dl-meta">
            A primeira versão pública está saindo do forno.{' '}
            <a href={RELEASES_URL.replace('/latest', '')} target="_blank" rel="noreferrer">Acompanhar as releases</a>
          </p>
        )}
      </div>
    )
  }

  const href = r.state === 'ready' ? r.url : RELEASES_URL
  return (
    <div className="dl">
      <a className={`btn btn-${size} btn-primary`} href={href} data-loading={r.state === 'loading' || undefined}>
        <IconWindows /> Baixar para Windows
      </a>
      {showMeta && (
        <p className="dl-meta">
          {r.state === 'ready'
            ? <>Versão {r.version}{r.sizeMb ? ` · ${r.sizeMb} MB` : ''} · Windows 10 e 11, 64 bits</>
            : <>Windows 10 e 11, 64 bits · grátis</>}
        </p>
      )}
    </div>
  )
}

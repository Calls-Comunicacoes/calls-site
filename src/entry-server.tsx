import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'

/** Usado só no build: gera o HTML da página para os buscadores lerem sem JavaScript. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

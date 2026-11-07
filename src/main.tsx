import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Em produção o HTML já vem pré-renderizado (SEO): só "hidrata". No dev, renderiza do zero.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)

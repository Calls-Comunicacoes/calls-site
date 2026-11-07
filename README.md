<div align="center">

<img src="public/media/calls-logo-256.png" alt="Calls" width="96" />

# Calls Site

Site de download do **Calls**: estático, em pt-BR, com a identidade visual do Calls.

</div>

## Stack

Vite + React + TypeScript, sem dependências de runtime além do React. Publicado no **GitHub Pages** pelo workflow [`deploy.yml`](.github/workflows/deploy.yml) a cada push na `main`.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:5173/calls-site/
npm run build    # gera dist/
```

O site fica em `/calls-site/` no Pages. Com domínio próprio, gere com `SITE_BASE=/ npm run build` (ou troque o padrão em `vite.config.ts`).

## Botão de download

`src/release.ts` consulta a API do GitHub (`/repos/Calls-Comunicacoes/calls-releases/releases/latest`) e procura o asset `Calls-<versão>-win-x64.exe`.

| Situação | O que aparece |
|---|---|
| Release com o `.exe` | "Baixar para Windows" com link direto, versão e tamanho |
| Nenhuma release publicada (404) ou sem o `.exe` | "Em breve para Windows" (desabilitado) + link para as releases |
| API fora do ar ou limite de requisições | Link para `releases/latest` |

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `src/App.tsx` | Seções: hero, recursos, prévia, Calls+, FAQ, CTA e rodapé |
| `src/components/AppPreview.tsx` | Prévia do app desenhada em HTML/CSS (trocar por prints reais quando existirem) |
| `src/styles.css` | Tokens do `calls-design` v0.2, cantos de 2–4 px, sombras em camadas |
| `public/media/` | Callstor (3D, mascote, loading transparente em WebM) |

Os textos do Calls+ seguem a pesquisa em [`calls-docs/negocio/monetizacao.md`](https://github.com/Calls-Comunicacoes/calls-docs/blob/main/negocio/monetizacao.md).

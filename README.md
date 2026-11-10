<div align="center">

<img src="public/media/calls-logo-256.png" alt="Calls" width="96" />

<h1>Calls Site</h1>

<p>Site oficial de download do <strong>Calls</strong>, com prévia web do app e apoio ao projeto.</p>

<p>
  <a href="https://calls.fbrdev.com.br"><img src="https://img.shields.io/badge/no%20ar-calls.fbrdev.com.br-2EA043?style=flat-square&labelColor=070C4C" alt="No ar" /></a>
  <a href="https://github.com/Calls-Comunicacoes/calls-site/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/Calls-Comunicacoes/calls-site/deploy.yml?branch=main&style=flat-square&labelColor=070C4C&label=deploy" alt="Deploy" /></a>
  <img src="https://img.shields.io/badge/Vite-070C4C?style=flat-square&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/React-070C4C?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
</p>

<p>
  <a href="https://calls.fbrdev.com.br"><strong>Abrir o site</strong></a> ·
  <a href="#começando">Começando</a> ·
  <a href="#como-funciona">Como funciona</a> ·
  <a href="#estrutura">Estrutura</a>
</p>

</div>

---

## Começando

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # typecheck, build e pré-renderização em dist/
```

O build gera o HTML já renderizado (`src/entry-server.tsx` + `scripts/prerender.mjs`), o que deixa o site rápido e indexável sem servidor.

## Como funciona

### Botão de download

`src/release.ts` consulta `GET /repos/Calls-Comunicacoes/calls-releases/releases/latest` e procura o asset `Calls-<versão>-win-x64.exe`.

| Situação | O que aparece |
|---|---|
| Release com o `.exe` | **Baixar para Windows**, com link direto, versão e tamanho |
| Nenhuma release ou sem `.exe` | **Em breve para Windows** (desabilitado) e link para as releases |
| API fora do ar ou limite atingido | Link para `releases/latest` |

### Prévia web do app (`/app/`)

`public/app/` é o build web do próprio app desktop (`calls-desktop`, `vite.web.config.ts`). Depois de mudar o app:

```bash
npm run sync:app   # gera o build web e copia para public/app
```

Basta commitar `public/app` e fazer push: o site e a prévia publicam juntos.

### Conta e apoio

O site usa o mesmo backend do app (`api.fbrdev.com.br`). A pessoa entra com a conta do Calls, escolhe um nível de apoio e é levada ao Mercado Pago pela função `apoio-checkout` do [`calls-server`](https://github.com/Calls-Comunicacoes/calls-server). A página do Apoia.se fica em `APOIASE_URL`, em `src/config.ts`.

> [!NOTE]
> A chave em `src/config.ts` é a **publicável** do Supabase e pode ficar no código. Todo acesso é protegido por RLS no banco.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `src/App.tsx` | Seções: topo, recursos, prévia, Calls+, FAQ e download |
| `src/components/` | Botões de download e conta, diálogo de apoio, campanha e prévia do app |
| `src/release.ts` | Busca da última release |
| `src/config.ts` | URLs do backend, da prévia e do Apoia.se |
| `src/styles.css` | Tokens do `calls-design` |
| `public/media/` | Logo, Callstor (imagens, vídeo do hero e loading em WebM) |
| `public/app/` | Prévia web do app |
| `scripts/` | Pré-renderização, sincronização da prévia e capturas de tela |

## Deploy

Cada push na `main` dispara o workflow [`deploy.yml`](.github/workflows/deploy.yml), que publica no **GitHub Pages** com domínio próprio (`public/CNAME`). O DNS fica na Hostinger: `CNAME calls → calls-comunicacoes.github.io`.

Os textos do Calls+ seguem a [pesquisa de monetização](https://github.com/Calls-Comunicacoes/calls-docs/blob/main/negocio/monetizacao.md).

---

<sub>© Calls Comunicações · Feito no Brasil</sub>

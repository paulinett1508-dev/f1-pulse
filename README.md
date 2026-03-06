# F1 Pulse

Dashboard de Fórmula 1 com dados em tempo real.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** — build e dev server
- **Tailwind CSS** — estilização
- **React Router 7** — rotas SPA
- **TanStack Query** — data fetching e cache
- **Zustand** — state management
- **Framer Motion** — animações
- **Vitest** + Testing Library — testes

## Getting Started

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (porta 3001)
npm run dev

# Build de produção
npm run build

# Preview do build local
npm run preview
```

## Deploy

### Vercel (produção)

O projeto está hospedado na Vercel. URL de produção:

```
https://f1-pulse-eight.vercel.app
```

- Push na `main` faz deploy automático
- PRs e branches geram deploys de preview com URLs próprias
- Guia completo: [infra/SETUP-VERCEL.md](infra/SETUP-VERCEL.md)

### VPS (alternativo)

Deploy via Docker + Traefik em VPS: [infra/SETUP-VPS.md](infra/SETUP-VPS.md)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server com HMR |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build local |
| `npm run lint` | Lint com ESLint |
| `npm test` | Rodar testes |
| `npm run test:watch` | Testes em modo watch |

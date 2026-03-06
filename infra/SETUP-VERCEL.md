# Deploy na Vercel — Guia Completo

## Status atual

O projeto **f1-pulse** já está vinculado à Vercel.
Configuração existente:

- `.vercel/project.json` — IDs do projeto e organização
- `vercel.json` — Rewrite para SPA (`/(.*) → /index.html`)

---

## 1. Onde encontrar a URL do deploy

### URL de produção

```
https://f1-pulse-eight.vercel.app
```

> **Nota:** A Vercel pode adicionar um sufixo (como `-eight`) quando o nome do projeto já existe na plataforma.

### Padrões de URL da Vercel

| Tipo | Exemplo |
|------|---------|
| Produção | `f1-pulse-eight.vercel.app` |
| Preview (por branch) | `f1-pulse-eight-git-<branch>-<usuario>.vercel.app` |
| Preview (por commit) | `f1-pulse-eight-<hash>-<usuario>.vercel.app` |

### Como achar no Dashboard

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no projeto **f1-pulse**
3. Na aba **Deployments**, cada deploy mostra a URL ao lado do status
4. O deploy de produção (branch `main`) aparece no topo com o link principal
5. Na página inicial do projeto, o botão **"Visit"** leva direto para a URL de produção

### Pelo CLI

```bash
# Ver os deploys recentes e suas URLs
npx vercel ls

# Ver o deploy de produção atual
npx vercel inspect --prod
```

---

## 2. Deploy automático (recomendado)

Se o repositório estiver conectado ao GitHub na Vercel:

- **Push na `main`** → deploy de produção automático
- **Push em outra branch / PR** → deploy de preview automático

Nenhum comando manual é necessário.

---

## 3. Deploy manual via CLI

```bash
# Instalar CLI (se necessário)
npm i -g vercel

# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

---

## 4. Domínio customizado (opcional)

1. No dashboard do projeto → **Settings** → **Domains**
2. Adicione o domínio desejado (ex: `f1pulse.seudominio.com`)
3. Configure o DNS conforme instruções da Vercel (registro CNAME ou A)

---

## 5. Variáveis de ambiente

Se o projeto precisar de variáveis de ambiente:

1. Dashboard → **Settings** → **Environment Variables**
2. Adicione as variáveis para Production / Preview / Development

---

## Configuração do projeto

O `vercel.json` atual contém a rewrite para SPA:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

A Vercel detecta automaticamente que é um projeto Vite e usa:

- **Build Command:** `vite build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

---

## Comandos úteis

```bash
# Ver deploys e URLs
npx vercel ls

# Ver detalhes do deploy de produção
npx vercel inspect --prod

# Ver logs de um deploy
npx vercel logs <url-do-deploy>

# Remover um deploy
npx vercel remove <url-do-deploy>

# Listar variáveis de ambiente
npx vercel env ls
```

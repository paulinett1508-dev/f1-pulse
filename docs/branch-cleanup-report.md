# Branch Cleanup Report — 2026-03-08

## Resumo

Auditoria completa das branches do repositório `paulinett1508-dev/f1-pulse`.

---

## Estado das Branches Remotas

### Mergeadas no `main` — DELETAR

| Branch | Último commit | Situação |
|--------|---------------|----------|
| `claude/check-api-2026-data-F9HPh` | 2026-03-04 | Mergeada via PR |
| `claude/evaluate-repo-relevance-SY4kR` | 2026-03-03 | Mergeada via PR |
| `claude/merge-missing-features-dpUww` | 2026-03-06 | Mergeada via PR |

### Com commits não mergeados — MANTER

| Branch | Commits à frente do main | Conteúdo |
|--------|--------------------------|----------|
| `claude/audit-codebase-scaling-fb2eu` | 5 commits | feat: flip-card, track layout, Quick Bar, Sprint weekend, driver photos |
| `claude/restore-vercel-domain-1XUHR` | 2 commits | docs: claude.md atualizado, README com fontes de dados |

### Branch ativa (trabalho atual)

| Branch | Situação |
|--------|----------|
| `claude/cleanup-merged-branches-Y7RBk` | Branch atual — auditoria de limpeza |

### Branch de integração

| Branch | Situação |
|--------|----------|
| `main` | Branch principal de produção |

---

## Script de Limpeza

Execute no terminal (com permissões de owner/admin):

```bash
# Deletar branches mergeadas no remote
git push origin --delete \
  claude/check-api-2026-data-F9HPh \
  claude/evaluate-repo-relevance-SY4kR \
  claude/merge-missing-features-dpUww

# Limpar referências remotas obsoletas localmente
git remote prune origin

# Verificar o que sobrou
git branch -r
```

---

## Branches Locais

| Branch | Situação |
|--------|----------|
| `master` | Já mergeada no `main` — pode ser deletada localmente |
| `claude/cleanup-merged-branches-Y7RBk` | Branch ativa atual |

```bash
# Deletar branch local obsoleta
git branch -d master
```

---

## Recomendações

1. **`claude/audit-codebase-scaling-fb2eu`** — Revisar os 5 commits de feature (flip-card no RaceCard, track layout, Quick Bar, Sprint weekend, driver photos) e abrir PR para merge no `main` ou descartar se supersedido.

2. **`claude/restore-vercel-domain-1XUHR`** — Revisar os 2 commits de docs e mergear no `main` se relevantes.

3. Após limpeza, o repositório terá apenas branches com trabalho em andamento ou planejado, eliminando a confusão visual entre branches ativas, mergeadas e órfãs.

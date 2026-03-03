# F1 Pulse - Projeto MVP

## Contexto
App de telemetria F1 real-time.

## Stack (Antigravity)
- React 19 + Vite
- Tailwind CSS (F1 Theme: #0A0A0A e #E10600)
- Claude Code para automação

## Objetivo Imediato
Setup inicial da estrutura de pastas e Dashboard Skeleton.

## Design System

O `tailwind.config.js` contém tokens semânticos organizados por domínio:

- **Core**: `f1black`, `f1red`, `f1silver` — branding F1
- **Flag states**: `flag-green`, `flag-yellow`, `flag-red` — status da corrida
- **Tyre compounds**: `tyre-soft`, `tyre-medium`, `tyre-hard`, `tyre-inter`, `tyre-wet`
- **Telemetry**: `telemetry-throttle`, `telemetry-brake`, `telemetry-bar`
- **Status**: `status-live`, `status-connected`, `status-warning`, `status-offline`
- **Shadows**: `shadow-card`, `shadow-card-hover`, `shadow-glow-red`, `shadow-glow-green`

Ao criar novos componentes, usar os tokens semânticos (ex: `bg-flag-green`, `text-status-live`, `shadow-glow-red`) em vez de hex hardcoded.

## Avaliação de Repos Externos (2026-03-03)

### Descartados
- **gsd-build/get-shit-done**: Sistema de orquestração de desenvolvimento. Overkill para MVP atual (~1.100 LOC). Revisitar se o projeto escalar para múltiplas features complexas.
- **hesreallyhim/awesome-claude-code**: Lista curada de ferramentas Claude Code. Referência apenas, nada para incorporar no app.

### Parcialmente Incorporado
- **nextlevelbuilder/ui-ux-pro-max-skill**: Conceitos de design system tokens absorvidos no `tailwind.config.js` (cores semânticas, shadows, elevations). Não instalamos o CLI — apenas aplicamos os princípios de tokenização ao tema F1 existente.

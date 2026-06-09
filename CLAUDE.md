# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AI Tarot — AI-powered tarot reading app built with Next.js App Router.

## Commands

```bash
npm run dev     # Start dev server (requires Node >=20.9, use nvm use v22)
npm run build   # Production build
npm run lint    # ESLint
```

## Architecture

- **Framework**: Next.js 16 App Router + TypeScript + Tailwind CSS v4
- **State**: Zustand — `useTarotStore` (card draws, spread, LLM settings) and `useChatStore` (chat messages, streaming), both localStorage-persisted; `StoreInitializer` loads all persisted state once in root layout
- **Animations**: Framer Motion for card flips, page transitions, modals, floating chat panel
- **LLM**: Dual-path — client-side direct streaming (`src/lib/llm-stream.ts`) is the primary path; server proxy (`src/app/api/interpret/route.ts`) available for self-hosting. Shared provider config in `src/lib/llm-providers.ts`. Supports OpenAI, Anthropic, DeepSeek with `AbortController` for cancellation.
- **Styling**: 8 dynamic themes via CSS custom properties injected by `ThemeProvider`; dark mystical aesthetic; CSS card-flip using `backface-visibility`; glass-morphism cards
- **Sounds**: Web Audio API light sound effects (`src/lib/sounds.ts`) — draw, flip, complete

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home — moon phase, daily card, spread selection |
| `/spread/[type]` | Reading flow — question input, draw/select cards, single-card reveal, inline AI interpretation with follow-up |
| `/cards` | Card library — 78-card grid with search and arcana/suit filtering |
| `/card/[id]` | Card detail page with prev/next navigation |
| `/history` | Reading history — last 20 records |
| `/settings` | LLM provider + API key + model selection |
| `/api/interpret` | POST — streaming LLM proxy |

## Data

- 78 cards in `src/data/tarot-cards.ts` (22 Major + 56 Minor across 4 suits: wands, cups, swords, pentacles)
- 4 spread definitions in `src/data/spreads.ts` (single, three-card, celtic-cross, relationship); `visibleSpreadIds` controls which are shown
- Card meanings are in Chinese; prompt templates in `src/lib/prompts.ts` (5 interpretation styles)
- Deck logic (shuffle, draw, deal, custom selection) in `src/lib/deck.ts`
- 8 visual theme definitions in `src/lib/themes.ts`

## Key Patterns

- **useShallow** from zustand for store subscriptions to avoid unnecessary re-renders
- **Dynamic imports** for heavy libraries (`jspdf`, `html-to-image` in ExportButton)
- **`content-visibility: auto`** for large card grids (CardPickerModal)
- **`visibilitychange`** listener pauses canvas animation when tab is hidden
- Toast notifications via `useToast` store instead of browser `alert()`
- FAB-style floating chat panel instead of permanent bottom bar

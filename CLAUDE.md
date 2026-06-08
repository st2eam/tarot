# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mystic Tarot — AI-powered tarot reading app built with Next.js App Router.

## Commands

```bash
npm run dev     # Start dev server (requires Node >=20.9, use nvm use v22)
npm run build   # Production build
npm run lint    # ESLint
```

## Architecture

- **Framework**: Next.js 16 App Router + TypeScript + Tailwind CSS v4
- **State**: Zustand (`src/store/useTarotStore.ts`) — card draws, spread state, LLM settings (localStorage-persisted)
- **Animations**: Framer Motion for card flips, page transitions, modals
- **LLM**: Custom streaming API route (`src/app/api/interpret/route.ts`) proxies to OpenAI or Anthropic; SSE over fetch
- **Styling**: Dark mystical theme, Tailwind with purple/gold palette, CSS card-flip using `backface-visibility`

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Spread selection (Single/Three Card/Celtic Cross/Horseshoe/Relationship) |
| `/spread/[type]` | Main reading flow — draw, reveal, AI interpret |
| `/card/[id]` | Static card detail page |
| `/settings` | LLM provider + API key + model selection |
| `/api/interpret` | POST — streaming LLM proxy (OpenAI + Anthropic) |

## Data

- 78 cards in `src/data/tarot-cards.ts` (22 Major + 56 Minor across 4 suits)
- 5 spread definitions in `src/data/spreads.ts`
- Card meanings are in Chinese; prompt templates in `src/lib/prompts.ts`
- Deck logic (shuffle, draw, deal) in `src/lib/deck.ts`

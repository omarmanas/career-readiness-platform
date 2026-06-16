# Career Readiness Platform

A local-first career readiness web app built with React 19, TypeScript, and Vite. No backend, no authentication, and no external database — all state is persisted in localStorage. The app guides a candidate through selecting a career track, reviewing readiness status, resolving blocking gaps, organizing required documents, tracking training, and focusing on next actions. Supports English and Turkish UI via a custom typed i18n system.

## Current Status

MVP complete. Türkiye Kariyer Hazırlığı pilot track is production-ready with verified source URLs and confidence levels. USCG Candidate track is live and source-aware. Six additional preview tracks are available for UX validation and product testing.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build | Vite |
| Styles | Plain CSS (no framework, single App.css) |
| i18n | Custom typed system (174 keys, EN / TR) |
| Persistence | localStorage |
| Backend | None by design |

## Features

- **Dashboard** — Coach brief with current readiness summary, mission mode action queue highlighting the single next action, and weighted readiness score across four categories
- **Requirements mission queue** — Prioritized requirement list with source metadata, confidence levels, and action status ordering
- **Documents triage** — Focus card surfacing the most critical document gap; full inventory with status, action priority, and source links
- **Training tracker** — Training and milestone tracking sorted by action status
- **Readiness scoring** — Weighted four-category model (requirements, documents, training, milestones) with per-category breakdown
- **Source-backed guidance** — Each requirement and document links to official or authoritative sources with confidence levels (High / Medium / Low) and last-reviewed dates
- **Portfolio JSON validation pipeline** — Contract-defined `portfolio.json` import format with validation utilities; import UI is not yet implemented

## Available Career Tracks

| Track | Maturity |
|---|---|
| U.S. Coast Guard Candidate | Live |
| Türkiye Kariyer Hazırlığı | Live |
| Police Academy Candidate | Preview |
| EMT Candidate | Preview |
| Firefighter Candidate | Preview |
| Emergency Management Candidate | Preview |
| Maritime / Merchant Mariner Candidate | Preview |
| Security / Protective Services Candidate | Preview |

Preview tracks have demo-quality content and are not yet verified against official sources.

## Getting Started

```bash
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # production build
npm run lint     # ESLint check
```

## Project Structure

```
src/
  components/    — All UI components (screens and shared panels)
  data/          — sampleData.ts — all career track seed data
  utils/         — Utility modules for readiness scoring, actions, gaps,
                   intelligence, documents, requirements, constants,
                   portfolioJson, portfolioImport, preferences, display,
                   sourceMapping, localizedDisplay, progressStore
  i18n/          — en.ts, tr.ts — 174-key typed translation system
  types/         — TypeScript type definitions (index.ts, portfolioJson.ts)
  hooks/         — useProgress.ts — progress state and override management
  App.tsx        — Root component; screen routing via useState
  App.css        — All styles (single file)
  main.tsx       — Entry point
```

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for a full component and utility map.

## Key Architecture Decisions

- **No backend by design** — All data is seeded at build time; localStorage holds only user overrides and preferences
- **Override-then-derive pattern** — Seed data is never mutated; user progress overrides are applied at render time via `useProgress`
- **localStorage persistence** — Track selection, language, and all requirement/document/training/milestone status overrides are stored in localStorage
- **Portfolio validation pipeline** — A `portfolio.json` contract and validation utilities exist (`portfolioJson.ts`, `portfolioImport.ts`) but the import UI has not been built yet

## License

Private project.

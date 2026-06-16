# Project Status

## Current App Status

The Career Readiness Platform is a React + Vite + TypeScript local-only MVP. It
is ready for controlled review and product validation, but it should not be
described as production-ready.

The app has no backend, authentication, real user accounts, server-side storage,
or real document upload/storage. Progress and preferences are browser-local via
`localStorage`.

## Completed Major Milestones

- Added a career track selector with live and preview track support.
- Added the U.S. Coast Guard live demo track.
- Added preview/demo tracks for Police Academy, EMT, Firefighter, Emergency
  Management, Maritime / Merchant Mariner, Security / Protective Services, and
  localized Turkiye career readiness.
- Added readiness dashboard, score calculation, blockers, and action-first
  guidance.
- Added requirements, documents, training, milestones, readiness gaps, risk
  flags, and next-action generation.
- Added document intelligence and requirement intelligence panels.
- Added source/evidence metadata on requirement and document records.
- Added local progress override persistence for status changes.
- Added local selected-track and language preferences.
- Added `portfolio.json` contract documentation, example data, import mapping,
  and developer validation command.
- Added MVP freeze/QA checklist in `docs/06_MVP_Freeze_and_QA_Checklist.md`.

## Current Architecture

- UI: React components under `src/components`.
- App shell and navigation: `src/App.tsx`.
- Styling: `src/App.css` and `src/index.css`.
- Seed data: `src/data/sampleData.ts`.
- Core types: `src/types/index.ts`.
- Portfolio contract types: `src/types/portfolioJson.ts`.
- Readiness, gap, document, requirement, recommendation, and action utilities:
  `src/utils`.
- Progress persistence: `src/hooks/useProgress.ts` and
  `src/utils/progressStore.ts`.
- Preference persistence: `src/utils/preferences.ts`.
- Static example import data: `public/examples/portfolio.example.json`.
- Developer validation script: `scripts/validate-portfolio-json.mjs`.

The app currently computes readiness from checked-in seed data plus local
status overrides. It does not write to a remote service.

## Current Known UX Issues

- Some screens remain text-heavy and can require too much reading before action.
- Documents screen hierarchy needs more polish so missing or urgent evidence is
  easier to scan first.
- Coach-style guidance should remain practical and supportive without becoming
  verbose.
- Progressive disclosure should be used more consistently so details are
  available without dominating first impressions.
- The primary presentation should stay action-first: blockers, next actions, and
  immediate steps should remain ahead of deep analysis.
- Source/evidence transparency must remain visible enough for users to
  understand source metadata, confidence level, and verification status.
- Preview/demo track labeling should stay clear so users do not mistake demo
  requirements for current official requirements.

## Seeded Content Localization Rules

- Official agency names, source names, course names, certification names, and
  program acronyms should remain unchanged unless the original remains clear.
- Official source names should not be translated if translation would obscure
  the publisher or make manual source verification harder.
- Generic career track display labels may use localized wording when it improves
  comprehension and does not change the meaning.
- Track display labels and generic category labels are localized through the
  display helper in `src/utils/localizedDisplay.ts`, leaving the seed records and
  official source labels intact.
- Requirement and document titles may be localized only when the item is generic
  and not source-specific.
- When a term is official but unfamiliar, prefer adding a short localized helper
  phrase in a future display field rather than replacing the official term.
- The current seed model uses single display strings for titles, categories,
  descriptions, and notes. Broader bilingual content should wait for explicit
  localized display fields instead of overwriting source-specific English text.

## Next Recommended Sprint Themes

- Documents hierarchy cleanup: prioritize urgent, missing, expired, and
  recruiter-visible items before lower-priority details.
- Text-density reduction: shorten long cards, move explanations behind details,
  and keep screen openings focused on decisions.
- Action-first dashboard refinement: preserve the coach brief, blockers, and top
  next action as the dominant flow.
- Source policy alignment: keep source type, confidence level, and verification
  status language consistent across requirements, documents, and imported data
  without overstating reliability.
- Portfolio import readiness: decide whether public import UI is in scope and
  define validation/error UX before implementation.
- QA hardening: rerun desktop/mobile smoke tests from the MVP checklist after
  any UI changes.
- Production-readiness planning: define privacy, storage, auth, and document
  handling requirements before collecting real candidate data.

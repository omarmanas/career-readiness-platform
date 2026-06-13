# Career Readiness Platform

A React + Vite + TypeScript demo app for career readiness planning across
public safety, emergency services, maritime, military, and protective services
pathways.

The app helps a candidate choose a career track, see readiness status, identify
blocking gaps, review required documents, and focus on the next practical
actions. It is currently a local-only MVP. It does not include backend services,
authentication, real user accounts, file upload/storage, or database
persistence.

## Current MVP Capabilities

- Career track selector with live and preview/demo tracks.
- Readiness dashboard with score, blockers, and action-first guidance.
- Gap analysis and next-action generation from track requirements, documents,
  training, and milestones.
- Requirements inventory with status, priority, readiness impact, related
  documents/training, and source metadata.
- Document checklist and document intelligence for missing, expired, pending,
  verified, and available evidence.
- Training and milestone tracking.
- Local progress overrides for requirement, training, document, and milestone
  status.
- Local preferences for selected track and language.
- Developer-only `portfolio.json` validation pipeline and example data contract.
- English and Turkish UI copy support; current documentation focuses on the
  English MVP.

## Supported Career Tracks

The checked-in seed data includes:

- U.S. Coast Guard Candidate: live, source-aware demo track with official
  source metadata where available.
- Police Academy Candidate: preview/demo track.
- EMT Candidate: preview/demo track.
- Firefighter Candidate: preview/demo track.
- Emergency Management Candidate: preview/demo track.
- Maritime / Merchant Mariner Candidate: preview/demo track.
- Security / Protective Services Candidate: preview/demo track.
- Turkiye Career Readiness: localized preview/demo track.

Preview tracks are useful for product validation and UX testing, but their
requirements are demo content and are not yet production-verified. They must be
checked against current official, regulatory, employer, or training-provider
sources before real-world use.

## Local Development

Install dependencies:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Validate the example portfolio JSON import contract:

```bash
npm run validate:portfolio
```

## Data Model Overview

Core runtime types live in `src/types/index.ts`. Seed data lives in
`src/data/sampleData.ts`.

The main object is `CareerTrack`, which includes:

- Track identity: `id`, `title`, `targetRole`, `domain`, `market`,
  `description`, `status`, and `maturity`.
- Requirements: eligibility, application, medical, testing, background,
  training, or other readiness requirements.
- Documents: evidence records such as IDs, resumes, certificates, licenses,
  medical records, application packets, and training records.
- Training plan items: planned or completed preparation activities.
- Milestones: candidate progress markers.
- Readiness categories, risk flags, priority actions, and readiness gaps used by
  the dashboard and analysis views.

User progress is stored separately from seed data. The app writes local status
overrides to `localStorage` keys under `crp.progress.v1.{trackId}`. Language and
selected-track preferences use `crp.language.v1` and
`crp.selectedTrackId.v1`.

The `portfolio.json` contract is documented in
`docs/05_Portfolio_JSON_Contract.md`, with an example at
`public/examples/portfolio.example.json`. That contract represents portable seed
data only; it does not include local progress overrides, auth data, document file
contents, or computed readiness scores.

## Source and Evidence Metadata

Requirements and document checklist items can carry source/evidence metadata so
users can see where guidance came from and how much confidence to place in it.

Legacy source-attribution fields include:

- `sourceName`
- `sourceUrl`
- `sourceType`
- `lastReviewed`
- `jurisdiction`
- `confidenceLevel`

Newer guidance metadata can also appear under `source`, with source type,
source name, recommended source URL, review date, rationale, and confidence
level.

Source metadata is not a certification that the app is authoritative. It is a
transparency layer for origin, confidence level, and verification status.
Requirement and document guidance should be verified against current official,
regulatory, employer, or training-provider sources before a candidate relies on
it.

See `docs/SOURCE_POLICY.md` for source handling rules.

## Known Limitations

- Local-only demo app; no backend, database, or server-side persistence.
- No authentication or real user accounts.
- No real document upload, document storage, or file parsing.
- No public import UI; portfolio validation is developer-only.
- No live Google Sheets integration.
- No official government, agency, employer, or school endorsement.
- Preview tracks contain demo data and may not match current requirements.
- Requirements can change by jurisdiction, employer, waiver policy, program, and
  date.
- Readiness scores and next actions are guidance aids, not official eligibility
  determinations.
- Sensitive candidate data should not be entered into this local demo as if it
  were a secured production system.

## Future Roadmap

Likely next phases include:

- Controlled QA and user validation on the current MVP.
- Documents screen hierarchy improvements and reduced text density.
- More progressive disclosure across requirements, documents, and analysis.
- Public import UI for validated `portfolio.json` files.
- Google Sheets template/export workflow.
- Recruiter or advisor summary/export package.
- Additional live tracks with verified source coverage.
- Source review workflow and source freshness indicators.
- Real document handling strategy, privacy model, and security review.
- Authentication, backend persistence, and account sync if the product moves
  beyond local demo scope.

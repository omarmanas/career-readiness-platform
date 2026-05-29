# MVP Freeze and QA Checklist

## Current MVP Status

The Career Readiness Platform MVP is complete from an engineering perspective
as of Sprint 18. The app is ready for controlled review as a local-only demo.

This freeze does not mean the product is production-deployed. It means the MVP
feature surface is stable enough for structured QA, stakeholder review, and
controlled user validation.

## Completed Sprint Summary

| Sprint | Status | Summary |
|--------|--------|---------|
| Sprint 11 | Complete | Added USCG live track and preview tracks. |
| Sprint 12 | Complete | Added interactive progress tracking with localStorage persistence. |
| Sprint 13 | Complete | Added operational Action Center with blockers and ranked next actions. |
| Sprint 13.1 | Complete | Improved Requirements and Documents card hierarchy. |
| Sprint 13.2 | Complete | Polished action affordances and status controls. |
| Sprint 14 | Complete | Added `portfolio.json` contract, types, and example JSON. |
| Sprint 15 | Complete | Added import pipeline foundation and validation report. |
| Sprint 16 | Complete | Compressed Dashboard and moved deep analysis into Advanced Analysis. |
| Sprint 17 | Complete | Added dev-only validation for `portfolio.json` import. |
| Sprint 18 | Complete | Frozen MVP scope and added repeatable QA checklist. |

## Core User Flows

- Select the U.S. Coast Guard live track.
- Review readiness score, blockers, and Action Center next actions.
- Update requirement or document status from Dashboard, Requirements, or Documents.
- Refresh the browser and confirm local progress persists.
- Review requirement details, document details, source notes, and readiness context.
- Select preview tracks and confirm they are clearly marked as preview/demo content.
- Validate `public/examples/portfolio.example.json` through the dev-only import pipeline.

## Desktop QA Checklist

### Dashboard

- [ ] USCG live track loads.
- [ ] Preview tracks are selectable and read-only/demo-scoped.
- [ ] Readiness score is visible.
- [ ] Blockers are visible.
- [ ] Action Center is visible.
- [ ] Status update changes the readiness score.
- [ ] Browser refresh preserves progress.
- [ ] Advanced Analysis is collapsed by default.
- [ ] Advanced Analysis expands and shows the moved analysis panels.

### Requirements

- [ ] Cards are collapsed by default.
- [ ] Status control is visible.
- [ ] Changing status updates state.
- [ ] Details expand and collapse correctly.

### Documents

- [ ] Cards are collapsed by default.
- [ ] Status control is visible.
- [ ] Changing status persists.
- [ ] Details expand and collapse correctly.
- [ ] Verify source appears in details.

### Career Tracks

- [ ] USCG live track is visible.
- [ ] Preview tracks are marked as preview.
- [ ] Selected track is highlighted.

### Training Tracker

- [ ] Selected track trainings are visible.
- [ ] No broken empty state appears.

## Mobile QA Checklist

- [ ] Dashboard compact summary is visible.
- [ ] Score ring does not dominate the first mobile screen.
- [ ] Blockers and Next Actions appear before Advanced Analysis.
- [ ] Advanced Analysis is collapsed by default.
- [ ] Advanced Analysis expands on tap.
- [ ] Requirements cards are readable.
- [ ] Documents cards are readable.
- [ ] Status controls do not overflow.
- [ ] Navigation is usable.
- [ ] Text does not overlap or clip in primary workflows.

## Data and Import QA Checklist

- [ ] `npm run validate:portfolio` passes.
- [ ] Example JSON returns `valid: true`.
- [ ] Example JSON returns `schemaVersion: 1.0`.
- [ ] Example JSON returns no errors.
- [ ] Example JSON returns no warnings unless intentionally introduced for testing.
- [ ] Stats match the example file:
  - requirements: 5
  - documents: 5
  - trainings: 4
  - milestones: 4
- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.

## Known Limitations

- Progress persistence is localStorage only.
- No user authentication.
- No backend.
- No database.
- No public import UI yet.
- No Google Sheets live integration yet.
- Portfolio import validation exists but is developer-only.
- Preview tracks use placeholder/demo data.
- No recruiter PDF export yet.
- No real document upload or storage.
- Not official USCG or government software.
- Requirements must be verified with official sources and a recruiter.

## Out of Scope for MVP

- Authenticated user accounts.
- Server-side storage.
- Multi-user collaboration.
- Public file upload/import workflows.
- Live Google Sheets API integration.
- Recruiter PDF/export package generation.
- Real document storage.
- Admin/moderation workflows.
- Native mobile packaging.
- Official government-source certification.

## Next-Phase Backlog

- Controlled user validation.
- Dashboard compression feedback review.
- Public import UI.
- Google Sheets template/export workflow.
- Recruiter PDF/export view.
- Optional public demo repo cleanup.
- Private data/security audit.
- Second live track.
- PWA/mobile packaging evaluation.

## Freeze Criteria

Before controlled review, confirm:

- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run validate:portfolio` passes.
- [ ] Desktop QA checklist has been completed.
- [ ] Mobile QA checklist has been completed.
- [ ] Known limitations have been disclosed to reviewers.
- [ ] Reviewers understand this is a local-only MVP demo, not an official
      USCG/government system.

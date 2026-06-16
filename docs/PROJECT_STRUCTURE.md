# Project Structure

## Root layout

```
src/
  components/   — UI components (screens and shared panels)
  data/         — sampleData.ts — all career track seed data
  hooks/        — useProgress.ts — progress state hook
  i18n/         — en.ts, tr.ts — 174-key typed translation system
  types/        — index.ts, portfolioJson.ts — TypeScript type definitions
  utils/        — Business logic modules
  App.tsx       — Root component; screen routing via useState
  App.css       — All styles (single file, no CSS framework)
  main.tsx      — Entry point
  index.css     — CSS reset and base variables
```

---

## components/

**Dashboard screen**
- `DashboardView.tsx` — Screen shell; composes coach brief, action queue, and metric row
- `CoachBriefCard.tsx` — Readiness summary, top recommendation, and next milestone
- `ActionCenterPanel.tsx` — Mission mode queue; surfaces the single highest-priority next action
- `CompactMetricRow.tsx` — Compact counts across categories

**Requirements screen**
- `RequirementsView.tsx` — Screen shell; composes summary panel and inventory
- `RequirementSummaryPanel.tsx` — Blocking, in-progress, and missing counts
- `RequirementInventoryView.tsx` — Full list with status, priority, source, and inline override
- `RequirementIntelligencePanel.tsx` — Per-requirement source metadata and confidence level

**Documents screen**
- `DocumentsView.tsx` — Screen shell; composes focus card, summary, and inventory
- `DocumentFocusCard.tsx` — Focus card for the most critical document gap
- `DocumentSummaryPanel.tsx` — Coverage counts: verified, missing, needs-review
- `DocumentInventoryView.tsx` — Full list with status, action priority, source, and inline override
- `DocumentIntelligencePanel.tsx` — Per-document source metadata and guidance

**Training screen**
- `TrainingTrackerView.tsx` — Training and milestone list sorted by action status; inline overrides

**Career Tracks screen**
- `CareerTracksView.tsx` — Master-detail track selector with readiness score and top gaps

**Analysis screen**
- `AnalysisCenterView.tsx` — Screen shell; composes breakdown, gap panel, narrative, recruiter card
- `ReadinessBreakdownCard.tsx` — Four-category weighted readiness breakdown
- `GapAnalysisPanel.tsx` — Top gaps with severity badges and recommended actions
- `ReadinessNarrativePanel.tsx` — Plain-language readiness summary
- `RecruiterReadinessCard.tsx` — Recruiter-facing readiness signal

**Shared**
- `Badge.tsx` — Status/priority badge with tone variants
- `CollapsibleSection.tsx` — Collapsible section wrapper
- `SourceSection.tsx` — Source attribution block (publisher, URL, confidence, last-reviewed)

---

## utils/

| File | Responsibility |
|---|---|
| `readiness.ts` | Weighted readiness score calculation; milestone and category helpers |
| `actions.ts` | Next-action generation; execution summary and readiness narrative |
| `recommendations.ts` | Top coaching recommendation selection for the current state |
| `gaps.ts` | Gap detection from all four categories; severity ranking |
| `intelligence.ts` | Readiness breakdown and recruiter-readiness derivation |
| `documents.ts` | Document coverage helpers; risk summary and importance ranking |
| `requirements.ts` | Requirement filtering by open/blocking/high-impact status |
| `constants.ts` | Shared rank tables (severity, priority, effort, impact) |
| `display.ts` | Status/priority/severity to Badge tone mapping |
| `localizedDisplay.ts` | Localized track and category display names via i18n lookup |
| `sourceMapping.ts` | Legacy source attribution normalization to current `GuidanceSource` shape |
| `portfolioJson.ts` | `portfolio.json` schema validation helpers |
| `portfolioImport.ts` | Import pipeline: validates and maps portfolio JSON onto track state |
| `preferences.ts` | localStorage helpers for language and selected track ID |
| `progressStore.ts` | localStorage-backed per-track progress override store |

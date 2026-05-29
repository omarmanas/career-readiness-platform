# Portfolio JSON Contract

## Purpose

`portfolio.json` is the stable, versioned data contract for exporting and
importing a candidate's career readiness portfolio between Career Readiness
Platform and external sources (e.g. Google Sheets, manual JSON).

It represents **seed data** — the factual record of what a candidate has,
needs, and has completed — not derived scores or computed state.

Sprint 15 will add the import pipeline that reads this contract. This
document defines the contract first, independently of the UI.

---

## Schema Versioning

Every portfolio.json file must carry a `schemaVersion` field at the root.

```json
{ "schemaVersion": "1.0" }
```

| Version | Status    | Notes                                      |
|---------|-----------|--------------------------------------------|
| `1.0`   | Current   | Initial stable contract. All fields below. |

**Version evolution rules:**

- **Additive change** (new optional field): minor version bump (`1.0` → `1.1`).
  Older readers must tolerate unknown fields — do not reject on extras.
- **Breaking change** (field removed, renamed, or type changed): major version
  bump (`1.0` → `2.0`). Import pipeline must refuse unsupported major versions
  and surface a clear error to the user.
- The field `schemaVersion` itself is immutable — its key and type (`string`)
  must never change.

---

## Seed Data vs User Progress Separation

The app stores two distinct layers:

| Layer            | Location                          | Contents                                                   |
|------------------|-----------------------------------|------------------------------------------------------------|
| **Seed data**    | `src/data/sampleData.ts`          | Canonical track definitions, requirement/document structure |
| **User progress**| localStorage (`crp.progress.v1.*`)| Status overrides keyed by item ID                          |

`portfolio.json` carries **seed data only** — the track structure with
baseline statuses. It does NOT carry the localStorage override layer.

On import (Sprint 15), the import pipeline will:
1. Replace or supplement the in-memory seed for the matching track.
2. Leave the user-progress override layer untouched (or offer a merge).

This separation ensures that a "reset to defaults" remains possible by
clearing localStorage without losing the imported track structure.

---

## Stable ID Rules

IDs are the primary key for cross-referencing within the file.
They must follow these rules:

1. **Globally unique within the file.** No two items of any type may share
   an ID.
2. **Kebab-case, namespaced by track.** Pattern: `{track-prefix}-{type}-{slug}`.
   Examples: `uscg-req-eligibility`, `uscg-doc-medical`, `uscg-train-asvab`.
3. **Stable across exports.** An item's ID must not change between exports.
   Changing an ID breaks cross-references and user-progress overrides.
4. **No spaces, no uppercase, no special characters** beyond `-`.
5. **relatedDocumentIds / relatedRequirementIds / relatedTrainingIds** must
   reference IDs that exist in the same portfolio.json file.

---

## Google Sheets Mapping

A Google Sheets workbook exported to portfolio.json must have the following
tabs. Column names are case-sensitive.

### Tab: Track

One row per track (typically one row for a single-track export).

| Column         | Type   | Required | Notes                                         |
|----------------|--------|----------|-----------------------------------------------|
| id             | string | yes      | Stable track ID, e.g. `uscg-candidate`        |
| title          | string | yes      |                                               |
| targetRole     | string | yes      |                                               |
| domain         | string | yes      | e.g. `Military`, `Emergency Services`         |
| market         | string | yes      | e.g. `United States`                          |
| description    | string | yes      |                                               |
| status         | string | yes      | `Exploring` / `Preparing` / `Application Ready` |
| maturity       | string | yes      | `live` or `preview`                           |

---

### Tab: Requirements

One row per requirement.

| Column               | Type   | Required | Notes                                           |
|----------------------|--------|----------|-------------------------------------------------|
| id                   | string | yes      |                                                 |
| trackId              | string | yes      | Must match Track.id                             |
| title                | string | yes      |                                                 |
| description          | string | yes      |                                                 |
| category             | string | yes      | e.g. `Eligibility`, `Medical`, `Testing`        |
| requirementType      | string | yes      | `Required` / `Recommended` / `Optional` / `Blocking` |
| status               | string | yes      | `Not Started` / `In Progress` / `Completed` / `Missing` / `Needs Review` / `Waived` |
| priority             | string | yes      | `Low` / `Medium` / `High` / `Critical`          |
| readinessImpact      | number | yes      | Integer, 1–100                                  |
| relatedDocumentIds   | string | no       | Comma-separated IDs, e.g. `uscg-doc-id, uscg-doc-transcript` |
| relatedTrainingIds   | string | no       | Comma-separated IDs                             |
| notes                | string | no       |                                                 |
| sourceName           | string | no       |                                                 |
| sourceUrl            | string | no       |                                                 |
| sourceType           | string | no       | `Official` / `Training Provider` / `Internal` / `User Provided` |
| lastReviewed         | string | no       | ISO 8601 date, e.g. `2026-05-28`                |
| jurisdiction         | string | no       |                                                 |
| confidenceLevel      | string | no       | `High` / `Medium` / `Low`                       |

---

### Tab: Documents

One row per document checklist item.

| Column               | Type   | Required | Notes                                           |
|----------------------|--------|----------|-------------------------------------------------|
| id                   | string | yes      |                                                 |
| trackId              | string | yes      |                                                 |
| title                | string | yes      |                                                 |
| description          | string | yes      | Evidence record description — no file content   |
| category             | string | yes      |                                                 |
| status               | string | yes      | `Available` / `Missing` / `Pending` / `Needs Review` / `Verified` / `Expired` |
| importance           | string | yes      | `Low` / `Medium` / `High` / `Critical`          |
| evidenceType         | string | yes      | `Certificate` / `License` / `Resume` / `ID` / `Training Record` / `Medical` / `Application Packet` / `Other` |
| issuer               | string | yes      |                                                 |
| issueDate            | string | yes      | ISO 8601 or `Missing` / `Pending`               |
| expirationDate       | string | yes      | ISO 8601, `None`, or `See document`             |
| relatedRequirementIds| string | no       | Comma-separated IDs                             |
| relatedTrainingIds   | string | no       | Comma-separated IDs                             |
| readinessImpact      | number | yes      | Integer, 1–100                                  |
| privacyLevel         | string | yes      | `Public Summary` / `Recruiter Visible` / `Private` / `Sensitive` |
| notes                | string | no       |                                                 |
| sourceName           | string | no       |                                                 |
| sourceUrl            | string | no       |                                                 |
| sourceType           | string | no       |                                                 |
| lastReviewed         | string | no       |                                                 |
| jurisdiction         | string | no       |                                                 |
| confidenceLevel      | string | no       |                                                 |

---

### Tab: Trainings

One row per training plan item.

| Column    | Type   | Required | Notes                                                          |
|-----------|--------|----------|----------------------------------------------------------------|
| id        | string | yes      |                                                                |
| title     | string | yes      |                                                                |
| category  | string | yes      |                                                                |
| status    | string | yes      | `Completed` / `In Progress` / `Planned` / `Pending` / `Deferred` |
| priority  | string | yes      | `Low` / `Medium` / `High` / `Critical`                         |
| dueLabel  | string | yes      | Human-readable, e.g. `Next 30 days` or `Completed this month` |

---

### Tab: Milestones

One row per milestone.

| Column          | Type   | Required | Notes                                        |
|-----------------|--------|----------|----------------------------------------------|
| id              | string | yes      |                                              |
| title           | string | yes      |                                              |
| targetDateLabel | string | yes      | Human-readable, e.g. `Next 14 days`          |
| status          | string | yes      | `Completed` / `In Progress` / `Upcoming`     |

---

## Top-Level File Structure

```json
{
  "schemaVersion": "1.0",
  "exportedAt": "<ISO 8601 timestamp>",
  "source": "career-readiness-platform | google-sheets | manual",
  "track": { ... },
  "requirements": [ ... ],
  "documents": [ ... ],
  "trainings": [ ... ],
  "milestones": [ ... ]
}
```

Fields at root level:

| Field         | Type   | Required | Notes                                               |
|---------------|--------|----------|-----------------------------------------------------|
| schemaVersion | string | yes      | Must be a supported version (e.g. `"1.0"`)          |
| exportedAt    | string | yes      | ISO 8601 timestamp of export                        |
| source        | string | yes      | Origin system identifier                            |
| track         | object | yes      | Single track record                                 |
| requirements  | array  | yes      | May be empty (`[]`) but must be present             |
| documents     | array  | yes      | May be empty (`[]`) but must be present             |
| trainings     | array  | yes      | May be empty (`[]`) but must be present             |
| milestones    | array  | yes      | May be empty (`[]`) but must be present             |

---

## Validation Rules

The import pipeline (Sprint 15) must enforce these before writing to app state:

1. `schemaVersion` is present and in the supported versions list.
2. Root is a plain object (not array, not null, not primitive).
3. `track.id` and `track.title` are non-empty strings.
4. `requirements`, `documents`, `trainings`, `milestones` are arrays.
5. No duplicate IDs within any array or across arrays.
6. All `relatedDocumentIds` values reference IDs present in `documents`.
7. All `relatedTrainingIds` values reference IDs present in `trainings`.
8. All `relatedRequirementIds` values reference IDs present in `requirements`.
9. `readinessImpact` is a positive integer.
10. Enum fields (`status`, `priority`, `requirementType`, etc.) contain only
    allowed values.

Rules 5–10 are advisory for v1.0 import — violations should surface as
warnings, not hard rejections, to allow partial import with user confirmation.
Rules 1–4 are hard failures that must block import.

---

## Sprint 17 Dev-Only Validation

Sprint 17 adds a developer-only validation path for the checked-in example file:

```bash
npm run validate:portfolio
```

This command validates `public/examples/portfolio.example.json` through the
Sprint 15 import pipeline (`loadPortfolioJson`) and prints the import report.

Expected clean output:

```text
valid: true
schemaVersion: 1.0
errors: []
warnings: []
stats: {
  "requirements": 5,
  "documents": 5,
  "trainings": 4,
  "milestones": 4
}
```

The app also exposes `runPortfolioImportDevTest()` in
`src/utils/portfolioImportDevTest.ts` for manual developer checks in a Vite dev
session. It fetches `/examples/portfolio.example.json`, runs `loadPortfolioJson`,
and returns the validation report.

This is not user-facing import UI. It does not add upload controls, Google
Sheets integration, backend/auth/database behavior, or runtime app state writes.

---

## What Is Intentionally Out of Scope

These fields are **not** included in portfolio.json because they are derived
or computed by the app:

| Excluded field        | Reason                                                    |
|-----------------------|-----------------------------------------------------------|
| `readinessScore`      | Computed from requirements/docs/trainings/milestones      |
| `readinessCategories` | Static config with computed scores, not user data         |
| `riskFlags`           | App-defined static content, not user-editable             |
| `priorityActions`     | Derived from gap analysis, not directly importable        |
| `readinessGaps`       | Derived analysis, not portable seed data                  |
| `relatedGapIds`       | App-internal cross-reference, not portable                |
| `relatedActionIds`    | App-internal cross-reference, not portable                |
| Document file contents| No actual file bytes, PDFs, or images are stored or exported |
| User progress overrides| localStorage overrides are not part of seed data        |
| Auth tokens / PII     | No authentication data; privacy-sensitive fields are labels only |

# Source Policy

## Purpose

Requirement and document guidance must show where it came from and how reliable
it is. Source metadata helps users understand whether an item is official,
employer-specific, best-practice guidance, informed guidance, or an estimate.

This policy applies to future requirement and document data, including checked-in
seed data, imported `portfolio.json` records, and any later admin or content
workflow.

## Source Categories

Use the strongest accurate category available.

| Category | Use When | Examples |
| --- | --- | --- |
| `official/regulatory` | The requirement comes from a government, licensing, regulatory, academy, agency, or official program source. | Coast Guard recruiting page, state EMS office, POST commission, fire academy requirement page, maritime credentialing authority. |
| `employer requirement` | The requirement comes directly from a hiring employer, department, recruiter, academy, or program posting. | Job posting, department application packet, recruiter checklist, academy admissions packet. |
| `best practice` | The item is widely recommended preparation but is not itself a formal requirement. | Interview preparation, fitness baseline practice, document organization, study routine. |
| `informed` | The item is reasoned guidance based on related sources, common patterns, or domain knowledge, but no direct source confirms it as a current requirement. | Suggested sequencing, readiness advice, checklist item inferred from several sources. |
| `estimated` | The item is a placeholder, demo item, or rough estimate that needs validation before real use. | Preview-track demo requirement, guessed timeline, provisional document expectation. |

The current codebase contains both legacy source metadata and newer guidance
source metadata. When adding new data, keep the displayed meaning clear even if
field names differ.

## Required Metadata

For each requirement or document item, include as much of the following as is
available:

- Source name: the page, publisher, employer, agency, or program name.
- Source URL: a stable public URL when possible.
- Source category/type.
- Jurisdiction when relevant.
- Last reviewed date.
- Confidence level.
- Rationale or notes explaining why the item is required or recommended.

If no source URL is available, explain the source in notes rather than leaving
the item looking official by implication.

## Confidence Guidance

Use confidence honestly.

- `official`: use only when the item is directly supported by an official,
  regulatory, employer, or program source.
- `informed`: use when guidance is reasonable and source-aware but not directly
  stated as a current requirement.
- `estimated`: use when the item is provisional, demo-only, inferred weakly, or
  awaiting verification.

For legacy `High` / `Medium` / `Low` confidence fields:

- `High` should usually map to directly sourced official or employer material.
- `Medium` should usually map to informed or partially sourced guidance.
- `Low` should usually map to estimated, demo, or weakly sourced guidance.

Do not inflate confidence to make the app look more complete.

## Handling Rules

- Prefer official or regulatory sources when available.
- Use employer, recruiter, academy, program, or training-provider sources when
  those are the actual authority for the candidate pathway.
- Add a source URL whenever a stable URL exists.
- Keep `lastReviewed` current when source content is checked.
- Avoid presenting estimated, inferred, or demo items as official.
- Clearly label preview/demo content and any placeholder sources.
- Explain why an item is required, recommended, or useful in the item notes,
  rationale, or description.
- Do not claim the app is an official eligibility decision system.
- Do not rely on source metadata for secrets, tokens, private account data, or
  personal candidate records.

## Future Data Expectations

Before adding a new live track or promoting a preview track:

- Review each requirement against a current source.
- Review each document item against the requirement it supports.
- Confirm related requirement/document/training IDs are accurate.
- Add or update rationale explaining why the user should care.
- Set confidence to the lowest honest level if sources are incomplete.
- Re-run the relevant validation and smoke checks.

For imported data, validation should surface missing source names, missing URLs,
old review dates, low confidence, and estimated items as warnings rather than
silently treating them as authoritative.

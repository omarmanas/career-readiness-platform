# Source QA Checklist

## Purpose

Use this checklist before pilot or public release to review local source
metadata for requirements and documents. The goal is to catch records that may
overstate reliability, especially preview/demo records and homepage-only source
URLs.

This checklist does not verify URLs automatically and does not replace manual
review.

## Manual Verification Fields

For each source record, confirm:

- Opens correctly.
- Relevant official requirement page.
- Not homepage-only.
- Not placeholder/example URL.
- Source label matches actual evidence.
- Confidence level is not overstated.

## Risk Patterns To Check

- `Official`, `official`, `official_regulatory`, or `regulatory` source with no
  `sourceUrl`.
- Official/regulatory source pointing to `example.gov`, `example.edu`,
  `example.com`, or another placeholder URL.
- Official/regulatory source pointing only to a generic homepage.
- `High`, `high`, or `official` confidence with no `sourceUrl`.
- `estimated` source type paired with high or official confidence.
- `User Provided` or `Internal` source paired with high or official confidence.
- `sourceName` containing "official" when source type/confidence is not
  actually official.
- `sourceUrl` present without `sourceName`.
- `sourceName` present without `sourceUrl`.

## Local QA Script

Run:

```bash
npm run source:qa
```

The script scans local seed/source files only:

- `src/data/sampleData.ts`
- `public/examples/portfolio.example.json`

It prints warnings and a category summary. Warnings are non-blocking and the
script exits with code 0 by default so existing demo data does not break builds.

## Interpreting Results

- Treat each warning as a manual review queue item.
- A warning does not prove the source is wrong.
- Do not mark a source as official unless the URL is a relevant official or
  regulatory requirement page.
- Homepage-only URLs can still be useful, but should usually be marked as
  source-aware or informed guidance rather than fully verified official
  requirements.
- Placeholder/example URLs should remain demo-only or be replaced before pilot
  or public release.

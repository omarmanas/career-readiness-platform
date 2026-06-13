# Pilot Visual QA Checklist

This checklist is for pilot/demo visual readiness only. It does not verify source
URLs, production privacy requirements, backend readiness, authentication, or real
document storage.

## Viewport Matrix

- [ ] English desktop around 1280px wide.
- [ ] English mobile around 390px wide.
- [ ] Turkish desktop around 1280px wide.
- [ ] Turkish mobile around 390px wide.

For each viewport, check:

- [ ] No horizontal overflow.
- [ ] No clipped text in headers, cards, controls, buttons, badges, or selects.
- [ ] No awkward wrapping that makes key actions hard to read.
- [ ] Status and priority labels remain readable.
- [ ] Primary next action is visible early.
- [ ] Cards remain scannable.
- [ ] Turkish labels are natural and not too long.
- [ ] Official acronyms and source-specific names remain unchanged.

## Track Selector / Career Tracks

- [ ] Track picker labels are readable in the top bar.
- [ ] Career track list labels wrap cleanly on mobile.
- [ ] English mode keeps original track labels.
- [ ] Turkish mode shows safe localized display labels for generic track names.
- [ ] Preview badges remain readable.
- [ ] Track detail panel does not feel crowded.
- [ ] Generic category labels localize where supported.
- [ ] Official/source-specific content is not translated incorrectly.

## Dashboard First Screen

- [ ] Mission card shows current readiness status clearly.
- [ ] The first recommended action is visible without excessive scrolling.
- [ ] Readiness score/status is readable on mobile.
- [ ] Coach guidance is concise and does not dominate the whole first screen.
- [ ] Track context label is not clipped.
- [ ] Summary chips and status controls wrap safely.

## Action Center

- [ ] Blockers appear before lower-priority recommendations.
- [ ] Supporting queued actions are compact on mobile.
- [ ] Overflow queued actions remain accessible.
- [ ] Action titles, impact labels, and status controls are readable.
- [ ] Official acronyms in action titles remain unchanged.

## Requirements Screen

- [ ] Coach panel explains what to handle first.
- [ ] Blocking and needs-action requirements are easy to scan.
- [ ] Card title, status, priority, and next action are visible before expansion.
- [ ] Secondary rationale and source metadata stay behind details.
- [ ] Expanded details remain readable.
- [ ] Source/evidence details are accessible after expansion.

## Documents Screen

- [ ] Coach panel explains which document needs attention.
- [ ] Missing/expired/review-needed documents appear before ready documents.
- [ ] Document title, status, priority, and next action are visible before expansion.
- [ ] Secondary metadata does not dominate collapsed cards.
- [ ] Expanded evidence/source sections remain readable.
- [ ] Source/evidence details are accessible after expansion.

## Training Tracker

- [ ] Active training appears before completed training.
- [ ] Category labels, due labels, priority badges, and status controls are readable.
- [ ] Rows stack cleanly on mobile.
- [ ] Generic category labels localize where supported.

## Analysis / Gap Screens

- [ ] Readiness categories and gap cards are readable.
- [ ] Gap category metadata localizes where supported.
- [ ] Badges do not overflow.
- [ ] Analysis content remains useful without crowding the first visible region.
- [ ] Official/source-specific action and gap names remain unchanged.

## Source / Evidence Transparency

- [ ] Requirement source details are available in expanded sections.
- [ ] Document source/evidence details are available in expanded sections.
- [ ] Source names and official acronyms are not translated incorrectly.
- [ ] Demo/unverified source labels are not overstated.
- [ ] Confidence/source metadata remains visible when expanded.
- [ ] Official source URLs still require manual browser verification before pilot or public release.

## Empty / Low-Data States

- [ ] No-open-action states are readable.
- [ ] All-ready document/training states are readable.
- [ ] Messages stay coach-like and concise.
- [ ] Empty states do not imply production verification.

## Current QA Result Note

Sprint 64 visual QA was run against English desktop, English mobile, Turkish
desktop, and Turkish mobile using local Playwright checks at approximately
1280px and 390px widths.

Screens checked: Track selector / Career Tracks, Dashboard, mission card, Action
Center, Requirements, Documents, Training Tracker, Analysis Center, Gap Analysis,
and expanded requirement/document source-evidence sections.

Current findings:

- No horizontal overflow was detected in the checked viewports.
- English mode kept original track labels and generic category labels.
- Turkish mode showed localized track labels and generic category labels where
  supported.
- Official/source-specific terms such as USCG, ASVAB, and MEPS remained
  unchanged.
- Requirement and document source/evidence sections remained accessible after
  expansion.
- No visual or copy fixes were required during this pass.

Known remaining issues before any pilot/public release:

- Official source URLs still need manual browser verification.
- Preview/demo data remains not production-verified.
- This is visual demo readiness only; it does not cover backend, auth, privacy,
  document storage, or real user account readiness.

Assessment: visually acceptable for controlled pilot/demo review, but not
production-ready.

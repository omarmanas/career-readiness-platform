# Sprint History

Sprints 19–50. Based on git commit history.

| Sprint | Title | Key Changes |
|---|---|---|
| 19 | Localization Foundation | Custom typed i18n system; EN/TR key structure; `getText` typed lookup |
| 20 | Turkish Pilot Track | Türkiye Kariyer Hazırlığı track; 9 requirements, 10 documents, 7 trainings |
| 21 | Preference Persistence | localStorage for language and selected track; restored on reload |
| 22 | Turkish UI Coverage | Expanded Turkish translation coverage across all UI copy |
| 23 | Localization Audit | Consistency audit; normalized key usage across components |
| 24 | Pilot Requirement Notes | Completed Türkiye pilot requirement notes and guidance text |
| 25 | Pilot Freeze Blockers | Fixed language freeze bugs blocking pilot sign-off |
| 26 | — | No tagged commits; changes may have been merged into sprint 25 or 27 |
| 27 | Legacy Panel Removal | Removed unmounted legacy panels; cleaned dead component code |
| 28 | Pilot Visual Polish | Visual hierarchy improvements for pilot UI sign-off |
| 29 | Mobile Navigation | Compact mobile nav; reduced height and improved tap targets |
| 30 | Action-Oriented Dashboard | Dashboard restructured to lead with next actions, not score |
| 31 | Mission Mode Dashboard | Introduced mission mode framing; single-action focus card on dashboard |
| 32 | Requirements Mission Queue | Requirements screen reorganized as mission queue; improved hierarchy |
| 33 | — | No tagged commits; changes may have been merged into sprint 32 or 34 |
| 34 | Analysis Center | Extracted analysis center screen from dashboard; separate route |
| 35 | Milestone Progress | Surface and persist milestone progress; milestone status overrides |
| 36 | Source Metadata Foundation | Source metadata fields added to requirements and documents |
| 37 | Source Display Polish | Clarified source-backed detail sections; visual treatment for sources |
| 38 | Coach Brief | Coach brief card added to dashboard with readiness narrative |
| 39 | Turkish Source Backfill | Backfilled source metadata (publisher, URL, type) for all Türkiye requirements |
| 40 | Source Confidence | Confidence levels (High / Medium / Low) added to all source entries |
| 41 | Document Action Priority | Documents sorted by action status; blocking gaps surface first |
| 42 | Training Action Priority | Training items sorted by action status; open items surface first |
| 43 | Dashboard Consistency | Fixed dashboard state inconsistencies; score/action alignment |
| 44 | Redundancy Refactor | Removed duplicate verification data and redundant labels across 3 component groups |
| 45 | Visual Hierarchy Accents | Visual accents on action elements; two-column metric card grid on mobile |
| 46 | Dashboard Spacing & Scale | Increased section spacing; larger heading sizes; separated metric and action card backgrounds |
| 47 | Codebase Cleanup | Removed orphaned CSS classes; deleted dead function; moved dev utility to scripts/ |
| 48 | Source Section Component | Extracted `SourceSection` shared component; deduplicated rank tables; extracted readinessWeights constant |
| 49 | Türkiye Source URLs | Populated all Türkiye track sources with real URLs and verified confidence levels |
| 50 | Project Documentation | README rewrite; PROJECT_STRUCTURE.md; SPRINT_HISTORY.md |

---

## Current State

- MVP complete and build-stable; `npm run build && npm run lint` pass cleanly
- 2 live tracks (USCG Candidate, Türkiye Kariyer Hazırlığı); 6 preview tracks
- 23 components across 5 screens (Dashboard, Requirements, Documents, Training, Career Tracks) plus Analysis Center
- 15 utility modules; 241 i18n keys (EN/TR); `portfolio.json` validation pipeline implemented, import UI pending

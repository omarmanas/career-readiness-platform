import type { CareerTrack } from '../types'
import { getText, type Language } from '../i18n'
import {
  getBlockingRequirements,
  getHighestImpactMissingRequirement,
  getRequirementCoverage,
  getRequirementsNeedingReview,
} from '../utils/requirements'

interface RequirementSummaryPanelProps {
  selectedTrack: CareerTrack
  language: Language
}

export function RequirementSummaryPanel({
  selectedTrack,
  language,
}: RequirementSummaryPanelProps) {
  const coverage = getRequirementCoverage(selectedTrack)
  const blockingOpen = getBlockingRequirements(selectedTrack)
  const needsReview = getRequirementsNeedingReview(selectedTrack)
  const highestImpactMissing = getHighestImpactMissingRequirement(selectedTrack)

  return (
    <section
      className="document-summary-grid"
      aria-label={getText(language, 'requirements')}
    >
      <h3 className="summary-panel-heading">{getText(language, 'requirementIntelligence')}</h3>
      <article className="metric-card">
        <span>{getText(language, 'totalRequirements')}</span>
        <strong>{coverage.total}</strong>
        <div className="progress-bar" aria-hidden="true">
          <span style={{ width: `${coverage.percentage}%` }} />
        </div>
        <p>
          {coverage.percentage}% {getText(language, 'requiredCoverage')}
        </p>
      </article>
      <article className="metric-card">
        <span>{getText(language, 'requiredComplete')}</span>
        <strong>
          {coverage.requiredComplete}/{coverage.requiredTotal}
        </strong>
      </article>
      <article className="metric-card">
        <span>{getText(language, 'blockingOpen')}</span>
        <strong>{blockingOpen.length}</strong>
      </article>
      <article className="metric-card">
        <span>{getText(language, 'needsReview')}</span>
        <strong>{needsReview.length}</strong>
      </article>
      <article className="metric-card">
        <span>{getText(language, 'highestImpactMissing')}</span>
        <strong>{highestImpactMissing?.readinessImpact ?? 0}</strong>
        <p>{highestImpactMissing?.title ?? getText(language, 'none')}</p>
      </article>
    </section>
  )
}

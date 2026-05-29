import type { CareerTrack } from '../types'
import {
  getBlockingRequirements,
  getHighestImpactMissingRequirement,
  getRequirementCoverage,
  getRequirementsNeedingReview,
} from '../utils/requirements'

interface RequirementSummaryPanelProps {
  selectedTrack: CareerTrack
}

export function RequirementSummaryPanel({
  selectedTrack,
}: RequirementSummaryPanelProps) {
  const coverage = getRequirementCoverage(selectedTrack)
  const blockingOpen = getBlockingRequirements(selectedTrack)
  const needsReview = getRequirementsNeedingReview(selectedTrack)
  const highestImpactMissing = getHighestImpactMissingRequirement(selectedTrack)

  return (
    <section className="document-summary-grid" aria-label="Requirement summary">
      <article className="metric-card">
        <span>Total requirements</span>
        <strong>{coverage.total}</strong>
        <p>{coverage.percentage}% required coverage</p>
      </article>
      <article className="metric-card">
        <span>Required complete</span>
        <strong>
          {coverage.requiredComplete}/{coverage.requiredTotal}
        </strong>
        <p>Required or blocking items</p>
      </article>
      <article className="metric-card">
        <span>Blocking open</span>
        <strong>{blockingOpen.length}</strong>
        <p>Open blocking requirements</p>
      </article>
      <article className="metric-card">
        <span>Needs review</span>
        <strong>{needsReview.length}</strong>
        <p>Source or readiness review needed</p>
      </article>
      <article className="metric-card">
        <span>Highest-impact missing</span>
        <strong>{highestImpactMissing?.readinessImpact ?? 0}</strong>
        <p>{highestImpactMissing?.title ?? 'None'}</p>
      </article>
    </section>
  )
}

import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { requirementStatusTone, requirementTypeTone } from '../utils/display'
import {
  getBlockingRiskSummary,
  getRequirementCoverage,
} from '../utils/requirements'

interface RequirementIntelligencePanelProps {
  selectedTrack: CareerTrack
}

export function RequirementIntelligencePanel({
  selectedTrack,
}: RequirementIntelligencePanelProps) {
  const coverage = getRequirementCoverage(selectedTrack)
  const risk = getBlockingRiskSummary(selectedTrack)

  return (
    <article className="panel document-intelligence-panel">
      <div className="section-heading">
        <h3>Requirement Intelligence</h3>
        <span>{coverage.percentage}% required coverage</span>
      </div>
      <div className="compact-metric-row">
        <div>
          <span>Required Complete</span>
          <strong>
            {coverage.requiredComplete}/{coverage.requiredTotal}
          </strong>
        </div>
        <div>
          <span>Blocking Open</span>
          <strong>{risk.openBlocking.length}</strong>
        </div>
        <div>
          <span>Needs Review</span>
          <strong>{risk.needsReview.length}</strong>
        </div>
        <div>
          <span>Missing</span>
          <strong>{risk.missing.length}</strong>
        </div>
      </div>
      {risk.highestImpactMissingRequirement && (
        <article className="list-row">
          <div>
            <strong>{risk.highestImpactMissingRequirement.title}</strong>
            <p>Highest-impact missing requirement</p>
          </div>
          <div className="badge-pair">
            <Badge
              label={risk.highestImpactMissingRequirement.requirementType}
              tone={
                requirementTypeTone[
                  risk.highestImpactMissingRequirement.requirementType
                ]
              }
            />
            <Badge
              label={risk.highestImpactMissingRequirement.status}
              tone={
                requirementStatusTone[risk.highestImpactMissingRequirement.status]
              }
            />
          </div>
        </article>
      )}
    </article>
  )
}

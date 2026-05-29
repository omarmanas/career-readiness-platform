import { Badge } from './Badge'
import {
  getRequirementTypeText,
  getStatusText,
  getText,
  type Language,
} from '../i18n'
import type { CareerTrack } from '../types'
import { requirementStatusTone, requirementTypeTone } from '../utils/display'
import {
  getBlockingRiskSummary,
  getRequirementCoverage,
} from '../utils/requirements'

interface RequirementIntelligencePanelProps {
  selectedTrack: CareerTrack
  language: Language
}

export function RequirementIntelligencePanel({
  selectedTrack,
  language,
}: RequirementIntelligencePanelProps) {
  const coverage = getRequirementCoverage(selectedTrack)
  const risk = getBlockingRiskSummary(selectedTrack)

  return (
    <article className="panel document-intelligence-panel">
      <div className="section-heading">
        <h3>{getText(language, 'requirementIntelligence')}</h3>
        <span>
          {coverage.percentage}% {getText(language, 'requiredCoverage')}
        </span>
      </div>
      <div className="compact-metric-row">
        <div>
          <span>{getText(language, 'requiredComplete')}</span>
          <strong>
            {coverage.requiredComplete}/{coverage.requiredTotal}
          </strong>
        </div>
        <div>
          <span>{getText(language, 'blockingOpen')}</span>
          <strong>{risk.openBlocking.length}</strong>
        </div>
        <div>
          <span>{getText(language, 'needsReview')}</span>
          <strong>{risk.needsReview.length}</strong>
        </div>
        <div>
          <span>{getText(language, 'missing')}</span>
          <strong>{risk.missing.length}</strong>
        </div>
      </div>
      {risk.highestImpactMissingRequirement && (
        <article className="list-row">
          <div>
            <strong>{risk.highestImpactMissingRequirement.title}</strong>
            <p>{getText(language, 'highestImpactMissingRequirement')}</p>
          </div>
          <div className="badge-pair">
            <Badge
              label={getRequirementTypeText(
                language,
                risk.highestImpactMissingRequirement.requirementType,
              )}
              tone={
                requirementTypeTone[
                  risk.highestImpactMissingRequirement.requirementType
                ]
              }
            />
            <Badge
              label={getStatusText(
                language,
                risk.highestImpactMissingRequirement.status,
              )}
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

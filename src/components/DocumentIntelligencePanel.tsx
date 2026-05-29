import { Badge } from './Badge'
import {
  getPriorityText,
  getStatusText,
  getText,
  type Language,
} from '../i18n'
import type { CareerTrack } from '../types'
import { documentImportanceTone, documentTone } from '../utils/display'
import { getDocumentRiskSummary } from '../utils/documents'

interface DocumentIntelligencePanelProps {
  selectedTrack: CareerTrack
  language: Language
}

export function DocumentIntelligencePanel({
  selectedTrack,
  language,
}: DocumentIntelligencePanelProps) {
  const summary = getDocumentRiskSummary(selectedTrack)

  return (
    <article className="panel document-intelligence-panel">
      <div className="section-heading">
        <h3>{getText(language, 'documentIntelligence')}</h3>
        <span>
          {summary.coverage.percentage}% {getText(language, 'coverage')}
        </span>
      </div>
      <div className="compact-metric-row">
        <div>
          <span>{getText(language, 'missingCritical')}</span>
          <strong>{summary.missingCritical.length}</strong>
        </div>
        <div>
          <span>{getText(language, 'needsReview')}</span>
          <strong>{summary.needsReview.length}</strong>
        </div>
        <div>
          <span>{getText(language, 'expiringSoon')}</span>
          <strong>{summary.expiringSoon.length}</strong>
        </div>
        <div>
          <span>{getText(language, 'impactOpen')}</span>
          <strong>{summary.readinessImpact}</strong>
        </div>
      </div>
      {summary.highestImpactMissingDocument && (
        <article className="list-row">
          <div>
            <strong>{summary.highestImpactMissingDocument.title}</strong>
            <p>{getText(language, 'highestImpactMissingDocument')}</p>
          </div>
          <div className="badge-pair">
            <Badge
              label={getStatusText(
                language,
                summary.highestImpactMissingDocument.status,
              )}
              tone={documentTone[summary.highestImpactMissingDocument.status]}
            />
            <Badge
              label={getPriorityText(
                language,
                summary.highestImpactMissingDocument.importance,
              )}
              tone={
                documentImportanceTone[
                  summary.highestImpactMissingDocument.importance
                ]
              }
            />
          </div>
        </article>
      )}
    </article>
  )
}

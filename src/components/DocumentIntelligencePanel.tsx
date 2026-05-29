import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { documentImportanceTone, documentTone } from '../utils/display'
import { getDocumentRiskSummary } from '../utils/documents'

interface DocumentIntelligencePanelProps {
  selectedTrack: CareerTrack
}

export function DocumentIntelligencePanel({
  selectedTrack,
}: DocumentIntelligencePanelProps) {
  const summary = getDocumentRiskSummary(selectedTrack)

  return (
    <article className="panel document-intelligence-panel">
      <div className="section-heading">
        <h3>Document Intelligence</h3>
        <span>{summary.coverage.percentage}% coverage</span>
      </div>
      <div className="compact-metric-row">
        <div>
          <span>Missing Critical</span>
          <strong>{summary.missingCritical.length}</strong>
        </div>
        <div>
          <span>Needs Review</span>
          <strong>{summary.needsReview.length}</strong>
        </div>
        <div>
          <span>Expiring Soon</span>
          <strong>{summary.expiringSoon.length}</strong>
        </div>
        <div>
          <span>Impact Open</span>
          <strong>{summary.readinessImpact}</strong>
        </div>
      </div>
      {summary.highestImpactMissingDocument && (
        <article className="list-row">
          <div>
            <strong>{summary.highestImpactMissingDocument.title}</strong>
            <p>Highest-impact missing or unverified document</p>
          </div>
          <div className="badge-pair">
            <Badge
              label={summary.highestImpactMissingDocument.status}
              tone={documentTone[summary.highestImpactMissingDocument.status]}
            />
            <Badge
              label={summary.highestImpactMissingDocument.importance}
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

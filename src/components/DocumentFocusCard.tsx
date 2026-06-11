import { Badge } from './Badge'
import { getStatusText, getText, type Language } from '../i18n'
import type { CareerTrack } from '../types'
import { documentTone } from '../utils/display'
import { getDocumentRiskSummary } from '../utils/documents'

interface DocumentFocusCardProps {
  selectedTrack: CareerTrack
  language: Language
}

export function DocumentFocusCard({ selectedTrack, language }: DocumentFocusCardProps) {
  const { highestImpactMissingDocument } = getDocumentRiskSummary(selectedTrack)

  if (!highestImpactMissingDocument) return null

  return (
    <article className="document-focus-card">
      <span className="document-focus-kicker">{getText(language, 'highestImpactGap')}</span>
      <div className="document-focus-body">
        <strong>{highestImpactMissingDocument.title}</strong>
        <div className="badge-pair">
          <Badge
            label={getStatusText(language, highestImpactMissingDocument.status)}
            tone={documentTone[highestImpactMissingDocument.status]}
          />
          <Badge
            label={`+${highestImpactMissingDocument.readinessImpact} ${getText(language, 'pointAbbrev')}`}
            tone="success"
          />
        </div>
      </div>
    </article>
  )
}

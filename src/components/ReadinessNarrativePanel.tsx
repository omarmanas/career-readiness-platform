import type { CareerTrack } from '../types'
import { getText, type Language } from '../i18n'
import { getReadinessNarrative } from '../utils/actions'

interface ReadinessNarrativePanelProps {
  selectedTrack: CareerTrack
  language: Language
}

export function ReadinessNarrativePanel({
  selectedTrack,
  language,
}: ReadinessNarrativePanelProps) {
  return (
    <article className="panel narrative-panel">
      <div className="section-heading">
        <h3>{getText(language, 'trackReadinessNarrative')}</h3>
        <span>{getText(language, 'deterministicSummary')}</span>
      </div>
      <p>{getReadinessNarrative(selectedTrack)}</p>
    </article>
  )
}

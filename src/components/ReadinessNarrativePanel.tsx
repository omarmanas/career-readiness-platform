import type { CareerTrack } from '../types'
import { getReadinessNarrative } from '../utils/actions'

interface ReadinessNarrativePanelProps {
  selectedTrack: CareerTrack
}

export function ReadinessNarrativePanel({
  selectedTrack,
}: ReadinessNarrativePanelProps) {
  return (
    <article className="panel narrative-panel">
      <div className="section-heading">
        <h3>Track Readiness Narrative</h3>
        <span>Deterministic summary</span>
      </div>
      <p>{getReadinessNarrative(selectedTrack)}</p>
    </article>
  )
}

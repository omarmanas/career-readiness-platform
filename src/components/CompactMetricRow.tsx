import type { CareerTrack } from '../types'
import { getPriorityText, getText, type Language } from '../i18n'
import { getExecutionSummary } from '../utils/actions'

interface CompactMetricRowProps {
  selectedTrack: CareerTrack
  language: Language
}

export function CompactMetricRow({
  selectedTrack,
  language,
}: CompactMetricRowProps) {
  const summary = getExecutionSummary(selectedTrack)

  return (
    <section
      className="compact-metric-row"
      aria-label={getText(language, 'executionSummary')}
    >
      <div>
        <span>{getText(language, 'pending')}</span>
        <strong>{summary.pendingActions}</strong>
      </div>
      <div>
        <span>{getText(language, 'completed')}</span>
        <strong>{summary.completedActions}</strong>
      </div>
      <div>
        <span>{getText(language, 'critical')}</span>
        <strong>{summary.criticalActions}</strong>
      </div>
      <div>
        <span>{getText(language, 'avgEffort')}</span>
        <strong>{getPriorityText(language, summary.averageEffortLevel)}</strong>
      </div>
    </section>
  )
}

import type { CareerTrack } from '../types'
import { getExecutionSummary } from '../utils/actions'

interface CompactMetricRowProps {
  selectedTrack: CareerTrack
}

export function CompactMetricRow({ selectedTrack }: CompactMetricRowProps) {
  const summary = getExecutionSummary(selectedTrack)

  return (
    <section className="compact-metric-row" aria-label="Execution summary">
      <div>
        <span>Pending</span>
        <strong>{summary.pendingActions}</strong>
      </div>
      <div>
        <span>Completed</span>
        <strong>{summary.completedActions}</strong>
      </div>
      <div>
        <span>Critical</span>
        <strong>{summary.criticalActions}</strong>
      </div>
      <div>
        <span>Avg Effort</span>
        <strong>{summary.averageEffortLevel}</strong>
      </div>
    </section>
  )
}

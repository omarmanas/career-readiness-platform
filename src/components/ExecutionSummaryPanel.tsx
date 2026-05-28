import type { CareerTrack } from '../types'
import { getExecutionSummary } from '../utils/actions'

interface ExecutionSummaryPanelProps {
  selectedTrack: CareerTrack
}

export function ExecutionSummaryPanel({
  selectedTrack,
}: ExecutionSummaryPanelProps) {
  const summary = getExecutionSummary(selectedTrack)

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>Execution Summary</h3>
        <span>Generated queue</span>
      </div>
      <div className="health-grid">
        <div>
          <span>Pending Actions</span>
          <strong>{summary.pendingActions}</strong>
        </div>
        <div>
          <span>Completed Actions</span>
          <strong>{summary.completedActions}</strong>
        </div>
        <div>
          <span>Critical Actions</span>
          <strong>{summary.criticalActions}</strong>
        </div>
        <div>
          <span>Average Effort</span>
          <strong>{summary.averageEffortLevel}</strong>
        </div>
      </div>
    </article>
  )
}

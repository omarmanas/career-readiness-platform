import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { actionPriorityTone, actionStatusTone } from '../utils/display'
import { getWeeklyPlan } from '../utils/actions'

interface WeeklyPlanPanelProps {
  selectedTrack: CareerTrack
  limit?: number
  title?: string
}

export function WeeklyPlanPanel({
  selectedTrack,
  limit,
  title = 'Weekly Action Plan',
}: WeeklyPlanPanelProps) {
  const weeklyPlan = getWeeklyPlan(selectedTrack).slice(0, limit)

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>{title}</h3>
        <span>{weeklyPlan.length} actions</span>
      </div>
      <ol className="action-plan-list">
        {weeklyPlan.map((action) => (
          <li className="action-plan-item" key={action.id}>
            <div>
              <strong>{action.title}</strong>
              <p>
                {action.category} - {action.dueWindow}
              </p>
            </div>
            <div className="badge-pair">
              <Badge
                label={action.priority}
                tone={actionPriorityTone[action.priority]}
              />
              <Badge label={action.status} tone={actionStatusTone[action.status]} />
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}

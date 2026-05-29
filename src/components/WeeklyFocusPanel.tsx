import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { actionPriorityTone } from '../utils/display'
import { getTopActions } from '../utils/actions'
import { getProjectedImprovement } from '../utils/intelligence'

interface WeeklyFocusPanelProps {
  selectedTrack: CareerTrack
}

export function WeeklyFocusPanel({ selectedTrack }: WeeklyFocusPanelProps) {
  const weeklyActions = getTopActions(selectedTrack, 3)
  const projected = getProjectedImprovement(selectedTrack, 3)

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>What should I do this week?</h3>
        <span>{weeklyActions.length} recommended actions</span>
      </div>

      <div className="weekly-focus-grid">
        <div className="weekly-actions">
          {weeklyActions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              No pending actions. All gaps resolved or deferred.
            </p>
          ) : (
            <ol className="action-plan-list">
              {weeklyActions.map((action) => (
                <li className="action-plan-item" key={action.id}>
                  <div>
                    <strong>{action.title}</strong>
                    <p>
                      {action.category} — {action.dueWindow}
                    </p>
                  </div>
                  <Badge label={action.priority} tone={actionPriorityTone[action.priority]} />
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="projected-improvement">
          <p className="intel-subheading">Projected improvement</p>
          <div className="projected-scores">
            <div className="projected-score-item">
              <span>Current</span>
              <strong>{projected.currentScore}%</strong>
            </div>
            <div className="projected-arrow" aria-hidden="true">→</div>
            <div className="projected-score-item">
              <span>After these actions</span>
              <strong className="projected-after">{projected.projectedScore}%</strong>
            </div>
          </div>
          <div className="projected-gain">
            <span>+{projected.gain} pts estimated</span>
          </div>
          <p className="intel-note">
            Assumes completion of linked requirements, training, and documents.
          </p>
        </div>
      </div>
    </article>
  )
}

import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { calculateReadinessScore } from '../utils/readiness'
import { getRecommendationSet } from '../utils/recommendations'

interface NextActionsPanelProps {
  selectedTrack: CareerTrack
  limit?: number
}

export function NextActionsPanel({ selectedTrack, limit = 5 }: NextActionsPanelProps) {
  const { nextActions, projectedImprovementPts } = getRecommendationSet(selectedTrack, limit)
  const currentScore = calculateReadinessScore(selectedTrack)
  const projectedScore = Math.min(100, currentScore + projectedImprovementPts)

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>Next Actions</h3>
        <span>{nextActions.length} ranked</span>
      </div>

      {nextActions.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          No open actions. All non-blocking items are complete or deferred.
        </p>
      ) : (
        <>
          <ol className="next-actions-list">
            {nextActions.map((action, idx) => (
              <li className="next-action-item" key={action.id}>
                <div className="next-action-rank" aria-hidden="true">{idx + 1}</div>
                <div className="next-action-body">
                  <div className="next-action-header">
                    <strong>{action.title}</strong>
                    <div className="badge-pair">
                      <Badge
                        label={action.reason.priorityLevel}
                        tone={
                          action.reason.priorityLevel === 'Critical' ? 'danger'
                          : action.reason.priorityLevel === 'High' ? 'warning'
                          : action.reason.priorityLevel === 'Medium' ? 'info'
                          : 'neutral'
                        }
                      />
                    </div>
                  </div>
                  <p className="next-action-desc">{action.description}</p>
                  <div className="next-action-meta">
                    <span>{action.reason.category}</span>
                    <span className="next-action-impact">
                      +{action.reason.scoreContributionPts} pt{action.reason.scoreContributionPts !== 1 ? 's' : ''} readiness
                    </span>
                    {action.reason.unblocksCategory && (
                      <span className="next-action-unlocks">Unblocks category</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="next-actions-footer">
            <div className="next-actions-projection">
              <span>Current readiness</span>
              <strong>{currentScore}%</strong>
              <span className="next-actions-arrow" aria-hidden="true">→</span>
              <span>After these {nextActions.length} actions</span>
              <strong className="next-actions-projected">{projectedScore}%</strong>
              <span className="next-actions-gain">+{projectedImprovementPts} pts estimated</span>
            </div>
            <p className="intel-note">
              Estimate based on completion of shown items using the readiness weighting schema
              (requirements 40% / training 25% / documents 20% / milestones 15%).
              Verify with official source and recruiter. Requirements may change.
            </p>
          </div>
        </>
      )}
    </article>
  )
}

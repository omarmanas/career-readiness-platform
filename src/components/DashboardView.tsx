import type { CSSProperties } from 'react'
import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import {
  priorityTone,
  readinessCategoryTone,
  riskTone,
  trackTone,
} from '../utils/display'
import {
  calculateReadinessCategories,
  calculateReadinessScore,
  getAvailableDocumentCount,
  getCompletedMilestoneCount,
  getCompletedRequirementCount,
  getCompletedTrainingCount,
  getNextMilestone,
  getPriorityActions,
  getTopReadinessGaps,
  getTopRiskFlags,
  getTrackHealthSummary,
} from '../utils/readiness'

interface DashboardViewProps {
  selectedTrack: CareerTrack
}

export function DashboardView({ selectedTrack }: DashboardViewProps) {
  const readinessScore = calculateReadinessScore(selectedTrack)
  const nextMilestone = getNextMilestone(selectedTrack.milestones)
  const topRiskFlags = getTopRiskFlags(selectedTrack.riskFlags)
  const priorityActions = getPriorityActions(selectedTrack)
  const readinessCategories = calculateReadinessCategories(selectedTrack)
  const readinessGaps = getTopReadinessGaps(selectedTrack)
  const trackHealth = getTrackHealthSummary(selectedTrack)

  return (
    <section className="screen-stack">
      <article className="summary-panel">
        <div>
          <Badge label={selectedTrack.status} tone={trackTone[selectedTrack.status]} />
          <h3>{selectedTrack.title}</h3>
          <p>{selectedTrack.description}</p>
          <div className="meta-list">
            <span>{selectedTrack.domain}</span>
            <span>{selectedTrack.market}</span>
            <span>{selectedTrack.targetRole}</span>
          </div>
        </div>
        <div
          className="score-ring"
          style={
            {
              '--score': `${readinessScore}%`,
            } as CSSProperties
          }
          aria-label={`${readinessScore}% ready`}
        >
          <span>{readinessScore}%</span>
        </div>
      </article>

      <section className="metric-grid" aria-label="Readiness metrics">
        <article className="metric-card">
          <span>Readiness score</span>
          <strong>{readinessScore}%</strong>
          <p>Weighted by requirements, training, documents, milestones</p>
        </article>
        <article className="metric-card">
          <span>Requirements complete</span>
          <strong>
            {getCompletedRequirementCount(selectedTrack.requirements)} /{' '}
            {selectedTrack.requirements.length}
          </strong>
          <p>40% of readiness score</p>
        </article>
        <article className="metric-card">
          <span>Trainings complete</span>
          <strong>
            {getCompletedTrainingCount(selectedTrack.trainingPlan)} /{' '}
            {selectedTrack.trainingPlan.length}
          </strong>
          <p>25% of readiness score</p>
        </article>
        <article className="metric-card">
          <span>Documents available</span>
          <strong>
            {getAvailableDocumentCount(selectedTrack.documentChecklist)} /{' '}
            {selectedTrack.documentChecklist.length}
          </strong>
          <p>20% of readiness score</p>
        </article>
        <article className="metric-card">
          <span>Milestones complete</span>
          <strong>
            {getCompletedMilestoneCount(selectedTrack.milestones)} /{' '}
            {selectedTrack.milestones.length}
          </strong>
          <p>{nextMilestone?.title ?? 'No upcoming milestone'}</p>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h3>Readiness categories</h3>
          <span>Calculated demo scoring</span>
        </div>
        <div className="category-grid">
          {readinessCategories.map((category) => (
            <article className="category-card" key={category.id}>
              <div className="card-header">
                <strong>{category.name}</strong>
                <Badge
                  label={category.status}
                  tone={readinessCategoryTone[category.status]}
                />
              </div>
              <span>{category.score}%</span>
              <p>{category.description}</p>
              <small>Target {category.targetScore}% - {category.notes}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="two-column">
        <article className="panel">
          <div className="section-heading">
            <h3>Top readiness gaps</h3>
            <span>{readinessGaps.length} shown</span>
          </div>
          <div className="item-list">
            {readinessGaps.map((gap) => (
              <article className="list-row" key={gap.id}>
                <div>
                  <strong>{gap.title}</strong>
                  <p>{gap.detail}</p>
                </div>
                <Badge label={`${gap.gap} pt gap`} tone="warning" />
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <h3>Track health</h3>
            <span>Category summary</span>
          </div>
          <div className="health-grid">
            <div>
              <span>Strongest Area</span>
              <strong>{trackHealth.strongestArea.name}</strong>
            </div>
            <div>
              <span>Weakest Area</span>
              <strong>{trackHealth.weakestArea.name}</strong>
            </div>
            <div>
              <span>Categories On Target</span>
              <strong>
                {trackHealth.categoriesOnTarget}/{trackHealth.totalCategories}
              </strong>
            </div>
          </div>
        </article>
      </section>

      <section className="two-column">
        <article className="panel">
          <div className="section-heading">
            <h3>Top risk flags</h3>
            <span>{topRiskFlags.length} shown</span>
          </div>
          <div className="item-list">
            {topRiskFlags.map((risk) => (
              <article className="list-row" key={risk.id}>
                <div>
                  <strong>{risk.title}</strong>
                  <p>{risk.detail}</p>
                </div>
                <Badge label={risk.level} tone={riskTone[risk.level]} />
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <h3>Next priority actions</h3>
            <span>{priorityActions.length} active</span>
          </div>
          <div className="item-list">
            {priorityActions.map((action) => (
              <article className="list-row" key={action.id}>
                <div>
                  <strong>{action.title}</strong>
                  <p>
                    {action.ownerLabel} - {action.dueLabel}
                  </p>
                </div>
                <Badge
                  label={action.priority}
                  tone={priorityTone[action.priority]}
                />
              </article>
            ))}
          </div>
        </article>
      </section>
    </section>
  )
}

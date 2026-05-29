import { Badge } from './Badge'
import type { CareerTrack, DocumentStatus, RequirementStatus } from '../types'
import {
  documentTone,
  priorityTone,
  requirementStatusTone,
} from '../utils/display'
import { getRecommendationSet } from '../utils/recommendations'
import { calculateReadinessScore } from '../utils/readiness'

const REQUIREMENT_STATUSES: RequirementStatus[] = [
  'Not Started',
  'In Progress',
  'Completed',
  'Needs Review',
  'Missing',
  'Waived',
]

const DOCUMENT_STATUSES: DocumentStatus[] = [
  'Missing',
  'Pending',
  'Needs Review',
  'Available',
  'Verified',
  'Expired',
]

interface ActionCenterPanelProps {
  selectedTrack: CareerTrack
  isInteractive: boolean
  onReqStatusChange: (itemId: string, status: RequirementStatus) => void
  onDocStatusChange: (itemId: string, status: DocumentStatus) => void
}

export function ActionCenterPanel({
  selectedTrack,
  isInteractive,
  onReqStatusChange,
  onDocStatusChange,
}: ActionCenterPanelProps) {
  const { blockers, nextActions, projectedImprovementPts } =
    getRecommendationSet(selectedTrack, 5)
  const currentScore = calculateReadinessScore(selectedTrack)
  const projectedScore = Math.min(100, currentScore + projectedImprovementPts)

  // ── Blocker strip ──────────────────────────────────────────────────────────

  const blockerStrip =
    blockers.length === 0 ? (
      <section className="blockers-strip blockers-strip--clear" aria-label="Blockers">
        <span className="blockers-strip-label">Blockers</span>
        <span className="blockers-strip-clear">
          No blocking items — track is clear to advance.
        </span>
      </section>
    ) : (
      <section className="blockers-strip" aria-label="Blockers">
        <div className="blockers-strip-header">
          <span className="blockers-strip-label">Blockers</span>
          <Badge label={`${blockers.length} gating`} tone="danger" />
        </div>
        <div className="blockers-list">
          {blockers.map((blocker) => {
            const req = selectedTrack.requirements.find((r) => r.id === blocker.id)
            const currentStatus = req?.status ?? 'Not Started'
            return (
              <article className="blocker-item" key={blocker.id}>
                <div className="blocker-item-header">
                  <span className="blocker-item-title">{blocker.title}</span>
                  <div className="badge-pair">
                    <Badge
                      label={blocker.priority}
                      tone={
                        blocker.priority === 'Critical' ? 'danger' : 'warning'
                      }
                    />
                    <Badge label="Blocking" tone="danger" />
                  </div>
                </div>
                <p className="blocker-item-desc">{blocker.description}</p>
                <div className="status-control-row">
                  <span className="status-control-label">Status</span>
                  {isInteractive ? (
                    <select
                      className="status-control"
                      value={currentStatus}
                      onChange={(e) =>
                        onReqStatusChange(
                          blocker.id,
                          e.target.value as RequirementStatus,
                        )
                      }
                      aria-label={`Status for ${blocker.title}`}
                    >
                      {REQUIREMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge
                      label={currentStatus}
                      tone={requirementStatusTone[currentStatus]}
                    />
                  )}
                </div>
                <p className="blocker-item-footer">
                  Category: {blocker.category} — Verify with official source and
                  recruiter. Requirements may change.
                </p>
              </article>
            )
          })}
        </div>
      </section>
    )

  // ── Next actions queue ─────────────────────────────────────────────────────

  const actionsQueue = (
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
            {nextActions.map((action, idx) => {
              const isGapOnly = action.itemId === null

              // Resolve current status from the track for display
              let currentStatus: string | null = null
              if (action.itemType === 'requirement' && action.itemId) {
                const req = selectedTrack.requirements.find(
                  (r) => r.id === action.itemId,
                )
                currentStatus = req?.status ?? null
              } else if (action.itemType === 'document' && action.itemId) {
                const doc = selectedTrack.documentChecklist.find(
                  (d) => d.id === action.itemId,
                )
                currentStatus = doc?.status ?? null
              }

              return (
                <li className="next-action-item" key={action.id}>
                  <div
                    className="next-action-rank"
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </div>
                  <div className="next-action-body">
                    <div className="next-action-header">
                      <strong>{action.title}</strong>
                      <div className="badge-pair">
                        <Badge
                          label={action.sourceType}
                          tone={
                            action.sourceType === 'requirement'
                              ? 'warning'
                              : 'info'
                          }
                        />
                        <Badge
                          label={action.reason.priorityLevel}
                          tone={
                            priorityTone[
                              action.reason.priorityLevel as keyof typeof priorityTone
                            ] ?? 'neutral'
                          }
                        />
                        {isGapOnly && (
                          <Badge label="Info" tone="neutral" />
                        )}
                      </div>
                    </div>

                    <p className="next-action-desc">{action.description}</p>

                    <div className="next-action-meta">
                      <span>{action.reason.category}</span>
                      <span className="next-action-impact">
                        +{action.reason.scoreContributionPts} pt
                        {action.reason.scoreContributionPts !== 1 ? 's' : ''}{' '}
                        readiness
                      </span>
                      {action.reason.unblocksCategory && (
                        <span className="next-action-unlocks">
                          Unblocks category
                        </span>
                      )}
                    </div>

                    {/* Status control — same pattern as sub-pages */}
                    {!isGapOnly && (
                      <div className="status-control-row">
                        <span className="status-control-label">Status</span>
                        {isInteractive ? (
                          action.itemType === 'requirement' ? (
                            <select
                              className="status-control"
                              value={currentStatus ?? 'Not Started'}
                              onChange={(e) =>
                                onReqStatusChange(
                                  action.itemId!,
                                  e.target.value as RequirementStatus,
                                )
                              }
                              aria-label={`Status for ${action.title}`}
                            >
                              {REQUIREMENT_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <select
                              className="status-control"
                              value={currentStatus ?? 'Missing'}
                              onChange={(e) =>
                                onDocStatusChange(
                                  action.itemId!,
                                  e.target.value as DocumentStatus,
                                )
                              }
                              aria-label={`Status for ${action.title}`}
                            >
                              {DOCUMENT_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          )
                        ) : (
                          currentStatus && (
                            action.itemType === 'requirement' ? (
                              <Badge
                                label={currentStatus}
                                tone={
                                  requirementStatusTone[
                                    currentStatus as RequirementStatus
                                  ]
                                }
                              />
                            ) : (
                              <Badge
                                label={currentStatus}
                                tone={
                                  documentTone[currentStatus as DocumentStatus]
                                }
                              />
                            )
                          )
                        )}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="next-actions-footer">
            <div className="next-actions-projection">
              <span>Current readiness</span>
              <strong>{currentScore}%</strong>
              <span className="next-actions-arrow" aria-hidden="true">
                →
              </span>
              <span>After these {nextActions.length} actions</span>
              <strong className="next-actions-projected">
                {projectedScore}%
              </strong>
              <span className="next-actions-gain">
                +{projectedImprovementPts} pts estimated
              </span>
            </div>
            <p className="intel-note">
              Estimate based on completion of shown items using the readiness
              weighting schema (requirements 40% / training 25% / documents 20%
              / milestones 15%). Verify with official source and recruiter.
              Requirements may change.
            </p>
          </div>
        </>
      )}
    </article>
  )

  return (
    <>
      {blockerStrip}
      {actionsQueue}
    </>
  )
}

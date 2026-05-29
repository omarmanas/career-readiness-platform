import { Badge } from './Badge'
import type { CareerTrack, RequirementStatus } from '../types'
import {
  priorityTone,
  requirementStatusTone,
  requirementTypeTone,
} from '../utils/display'

const REQUIREMENT_STATUSES: RequirementStatus[] = [
  'Not Started',
  'In Progress',
  'Completed',
  'Needs Review',
  'Missing',
  'Waived',
]

interface RequirementInventoryViewProps {
  selectedTrack: CareerTrack
  isInteractive: boolean
  onStatusChange: (itemId: string, status: RequirementStatus) => void
}

export function RequirementInventoryView({
  selectedTrack,
  isInteractive,
  onStatusChange,
}: RequirementInventoryViewProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h3>Readiness Requirements</h3>
        <span>Verify with official source and recruiter</span>
      </div>
      <div className="requirement-list">
        {selectedTrack.requirements.map((requirement) => (
          <article className="requirement-card" key={requirement.id}>
            <div className="requirement-card-header">
              <div>
                <strong>{requirement.title}</strong>
                <p>{requirement.description}</p>
              </div>
              <div className="badge-pair">
                <Badge
                  label={requirement.requirementType}
                  tone={requirementTypeTone[requirement.requirementType]}
                />
                <Badge
                  label={requirement.priority}
                  tone={priorityTone[requirement.priority]}
                />
              </div>
            </div>

            <div className="status-control-row">
              <span className="status-control-label">Status</span>
              {isInteractive ? (
                <select
                  className="status-control"
                  value={requirement.status}
                  onChange={(e) =>
                    onStatusChange(requirement.id, e.target.value as RequirementStatus)
                  }
                  aria-label={`Status for ${requirement.title}`}
                >
                  {REQUIREMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ) : (
                <Badge
                  label={requirement.status}
                  tone={requirementStatusTone[requirement.status]}
                />
              )}
            </div>

            <div className="requirement-body">
              <div className="requirement-why">
                <span>Why it matters</span>
                <p>{requirement.notes}</p>
              </div>
              <div className="requirement-support">
                <div>
                  <span>Readiness impact</span>
                  <strong>{requirement.readinessImpact} pts</strong>
                </div>
                <div>
                  <span>Related docs</span>
                  <strong>{requirement.relatedDocumentIds.length}</strong>
                </div>
                <div>
                  <span>Related trainings</span>
                  <strong>{requirement.relatedTrainingIds.length}</strong>
                </div>
              </div>
            </div>

            {requirement.sourceName && (
              <div className="requirement-source-row">
                <span>Source</span>
                <small>
                  {requirement.sourceName} — {requirement.sourceType} — Last
                  reviewed {requirement.lastReviewed} — {requirement.jurisdiction}{' '}
                  — Confidence {requirement.confidenceLevel}
                </small>
                {requirement.sourceUrl && (
                  <a href={requirement.sourceUrl} target="_blank" rel="noreferrer">
                    Verify with official source and recruiter
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

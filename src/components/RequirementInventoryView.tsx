import { useState } from 'react'
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h3>Readiness Requirements</h3>
        <span>Verify with official source and recruiter</span>
      </div>
      <div className="requirement-list">
        {selectedTrack.requirements.map((req) => {
          const isExpanded = expandedIds.has(req.id)
          const counts = [
            req.relatedDocumentIds.length > 0
              ? `Docs: ${req.relatedDocumentIds.length}`
              : null,
            req.relatedTrainingIds.length > 0
              ? `Trng: ${req.relatedTrainingIds.length}`
              : null,
          ]
            .filter(Boolean)
            .join(' · ')

          return (
            <article className="requirement-card" key={req.id}>
              {/* ── Primary tier (always visible) ── */}
              <div className="card-primary-tier">
                <div className="card-left-col">
                  <strong className="card-item-title">{req.title}</strong>
                  <div className="card-badge-row">
                    <Badge
                      label={req.requirementType}
                      tone={requirementTypeTone[req.requirementType]}
                    />
                    <Badge
                      label={req.priority}
                      tone={priorityTone[req.priority]}
                    />
                    <Badge label={`+${req.readinessImpact} pts`} tone="success" />
                    {counts && (
                      <span className="card-count-text">{counts}</span>
                    )}
                  </div>
                </div>

                <div className="card-right-col">
                  {isInteractive ? (
                    <select
                      className="status-control status-control--card"
                      data-status={req.status}
                      value={req.status}
                      onChange={(e) =>
                        onStatusChange(req.id, e.target.value as RequirementStatus)
                      }
                      aria-label={`Status for ${req.title}`}
                    >
                      {REQUIREMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge
                      label={req.status}
                      tone={requirementStatusTone[req.status]}
                    />
                  )}
                  <button
                    className="card-toggle"
                    type="button"
                    onClick={() => toggleExpand(req.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? '▲ Less' : '▶ Details'}
                  </button>
                </div>
              </div>

              {/* ── Secondary tier (expanded on demand) ── */}
              {isExpanded && (
                <div className="card-secondary-tier">
                  <p className="card-item-desc">{req.description}</p>

                  <div className="requirement-why">
                    <span>Why it matters</span>
                    <p>{req.notes}</p>
                  </div>

                  <div className="requirement-support">
                    <div>
                      <span>Readiness impact</span>
                      <strong>{req.readinessImpact} pts</strong>
                    </div>
                    <div>
                      <span>Related docs</span>
                      <strong>{req.relatedDocumentIds.length}</strong>
                    </div>
                    <div>
                      <span>Related trainings</span>
                      <strong>{req.relatedTrainingIds.length}</strong>
                    </div>
                  </div>

                  {req.sourceName && (
                    <div className="requirement-source-row">
                      <span>Source</span>
                      <small>
                        {req.sourceName} — {req.sourceType} — Last reviewed{' '}
                        {req.lastReviewed} — {req.jurisdiction} — Confidence{' '}
                        {req.confidenceLevel}
                      </small>
                      {req.sourceUrl && (
                        <a href={req.sourceUrl} target="_blank" rel="noreferrer">
                          Verify with official source and recruiter
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

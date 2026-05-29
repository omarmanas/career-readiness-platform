import { useState } from 'react'
import { Badge } from './Badge'
import {
  getPriorityText,
  getRequirementTypeText,
  getStatusText,
  getText,
  type Language,
} from '../i18n'
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
  language: Language
  onStatusChange: (itemId: string, status: RequirementStatus) => void
}

export function RequirementInventoryView({
  selectedTrack,
  isInteractive,
  language,
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
        <h3>{getText(language, 'requirements')}</h3>
        <span>{getText(language, 'verifyOfficialSourceRecruiter')}</span>
      </div>
      <div className="requirement-list">
        {selectedTrack.requirements.map((req) => {
          const isExpanded = expandedIds.has(req.id)
          const counts = [
            req.relatedDocumentIds.length > 0
              ? `${getText(language, 'docsAbbrev')}: ${req.relatedDocumentIds.length}`
              : null,
            req.relatedTrainingIds.length > 0
              ? `${getText(language, 'trainingsAbbrev')}: ${req.relatedTrainingIds.length}`
              : null,
          ]
            .filter(Boolean)
            .join(' / ')

          return (
            <article className="requirement-card" key={req.id}>
              <div className="card-primary-tier">
                <div className="card-left-col">
                  <strong className="card-item-title">{req.title}</strong>
                  <div className="card-badge-row">
                    <Badge
                      label={getRequirementTypeText(language, req.requirementType)}
                      tone={requirementTypeTone[req.requirementType]}
                    />
                    <Badge
                      label={getPriorityText(language, req.priority)}
                      tone={priorityTone[req.priority]}
                    />
                    <Badge
                      label={`+${req.readinessImpact} ${getText(language, 'pointAbbrev')}`}
                      tone="success"
                    />
                    {counts && <span className="card-count-text">{counts}</span>}
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
                          {getStatusText(language, s)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge
                      label={getStatusText(language, req.status)}
                      tone={requirementStatusTone[req.status]}
                    />
                  )}
                  <button
                    className="card-toggle"
                    type="button"
                    onClick={() => toggleExpand(req.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded
                      ? `^ ${getText(language, 'less')}`
                      : `> ${getText(language, 'details')}`}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="card-secondary-tier">
                  <p className="card-item-desc">{req.description}</p>

                  <div className="requirement-why">
                    <span>{getText(language, 'whyItMatters')}</span>
                    <p>{req.notes}</p>
                  </div>

                  <div className="requirement-support">
                    <div>
                      <span>{getText(language, 'readinessImpact')}</span>
                      <strong>
                        {req.readinessImpact} {getText(language, 'pointAbbrev')}
                      </strong>
                    </div>
                    <div>
                      <span>{getText(language, 'relatedDocuments')}</span>
                      <strong>{req.relatedDocumentIds.length}</strong>
                    </div>
                    <div>
                      <span>{getText(language, 'relatedTrainings')}</span>
                      <strong>{req.relatedTrainingIds.length}</strong>
                    </div>
                  </div>

                  {req.sourceName && (
                    <div className="requirement-source-row">
                      <span>{getText(language, 'source')}</span>
                      <small>
                        {req.sourceName} - {req.sourceType} -{' '}
                        {getText(language, 'lastReviewed')} {req.lastReviewed} -{' '}
                        {req.jurisdiction} - {getText(language, 'confidence')}{' '}
                        {req.confidenceLevel}
                      </small>
                      {req.sourceUrl && (
                        <a href={req.sourceUrl} target="_blank" rel="noreferrer">
                          {getText(language, 'verifyOfficialSourceRecruiter')}
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

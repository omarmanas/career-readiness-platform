import { useState } from 'react'
import { Badge } from './Badge'
import { SourceSection } from './SourceSection'
import {
  getPriorityText,
  getRequirementTypeText,
  getStatusText,
  getText,
  type Language,
} from '../i18n'
import type {
  CareerTrack,
  GuidanceSource,
  RequirementStatus,
  TrackRequirement,
} from '../types'
import { mapLegacySourceToGuidanceSource } from '../utils/sourceMapping'
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

function getRequirementSource(req: TrackRequirement): GuidanceSource | null {
  if (req.source) return req.source
  return mapLegacySourceToGuidanceSource(req)
}

function getRequirementActionKey(req: TrackRequirement) {
  if (req.status === 'Missing' || req.status === 'Not Started') {
    return req.requirementType === 'Blocking'
      ? 'reqActionClearBlocker'
      : 'reqActionStart'
  }
  if (req.status === 'Needs Review') return 'reqActionReview'
  if (req.status === 'In Progress') return 'reqActionContinue'
  return 'reqActionKeepConfirmed'
}

function getRequirementReasonKey(req: TrackRequirement) {
  if (req.requirementType === 'Blocking') return 'reqReasonBlocksReadiness'
  if (req.priority === 'Critical' || req.priority === 'High') {
    return 'reqReasonHighPriority'
  }
  if (req.status === 'Completed' || req.status === 'Waived') {
    return 'reqReasonReadyCanWait'
  }
  return 'reqReasonCanWait'
}


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
  const [isActiveOpen, setIsActiveOpen] = useState(true)
  const [isCompletedOpen, setIsCompletedOpen] = useState(false)
  const incompleteRequirements = selectedTrack.requirements.filter(
    (req) => req.status !== 'Completed' && req.status !== 'Waived',
  )
  const missionQueue = incompleteRequirements.slice(0, 3)
  const missionIds = new Set(missionQueue.map((req) => req.id))
  const activeRequirements = incompleteRequirements.filter(
    (req) => !missionIds.has(req.id),
  )
  const completedExemptRequirements = selectedTrack.requirements.filter(
    (req) => req.status === 'Completed' || req.status === 'Waived',
  )
  const blockingRequirements = incompleteRequirements.filter(
    (req) => req.requirementType === 'Blocking',
  )
  const firstRequirementAction = missionQueue[0]

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function renderRequirementCard(
    req: TrackRequirement,
    index?: number,
    isMission = false,
  ) {
    const isExpanded = expandedIds.has(req.id)
    const source = getRequirementSource(req)
    const actionText = getText(language, getRequirementActionKey(req))
    const reasonText = getText(language, getRequirementReasonKey(req))
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
      <article
        className={
          isMission ? 'requirement-card requirement-card--mission' : 'requirement-card'
        }
        key={req.id}
      >
        <div className="card-primary-tier">
          {isMission && typeof index === 'number' && (
            <span className="requirement-mission-rank" aria-hidden="true">
              {index + 1}
            </span>
          )}
          <div className="card-left-col">
            <strong className="card-item-title">{req.title}</strong>
            <div className="card-badge-row card-badge-row--compact">
              <Badge
                label={getRequirementTypeText(language, req.requirementType)}
                tone={requirementTypeTone[req.requirementType]}
              />
              <Badge
                label={getPriorityText(language, req.priority)}
                tone={priorityTone[req.priority]}
              />
            </div>
            <p className="requirement-next-action">
              <strong>{actionText}</strong>
              <span>{reasonText}</span>
            </p>
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
            <div className="card-badge-row">
              <Badge
                label={`+${req.readinessImpact} ${getText(language, 'pointAbbrev')}`}
                tone="success"
              />
              {counts && <span className="card-count-text">{counts}</span>}
            </div>

            <p className="card-item-desc">{req.description}</p>

            <div className="requirement-why detail-section">
              <h5>{getText(language, 'whyThisMatters')}</h5>
              <p>{req.notes}</p>
            </div>

            <SourceSection source={source} language={language} />
          </div>
        )}
      </article>
    )
  }

  function renderMissionSection(
    title: string,
    requirements: TrackRequirement[],
    className = '',
  ) {
    if (requirements.length === 0) return null

    return (
      <section className={`requirement-mission-section ${className}`.trim()}>
        <div className="requirement-section-heading">
          <h4>{title}</h4>
          <span>{requirements.length}</span>
        </div>
        <div className="requirement-list">
          {requirements.map((req, index) => renderRequirementCard(req, index, true))}
        </div>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h3>{getText(language, 'requirements')}</h3>
        <span>{getText(language, 'topPriorityWork')}</span>
      </div>

      <section className="requirement-coach-panel">
        <div>
          <span>{getText(language, 'requirementCoachKicker')}</span>
          <h4>{getText(language, 'requirementCoachTitle')}</h4>
          <p>
            {firstRequirementAction
              ? getText(language, 'requirementCoachWithAction').replace(
                  '{requirement}',
                  firstRequirementAction.title,
                )
              : getText(language, 'requirementCoachAllReady')}
          </p>
        </div>
        <div
          className="requirement-coach-metrics"
          aria-label={getText(language, 'requirements')}
        >
          <span>
            <strong>{blockingRequirements.length}</strong>
            {getText(language, 'blockingShort')}
          </span>
          <span>
            <strong>{incompleteRequirements.length}</strong>
            {getText(language, 'needAttentionShort')}
          </span>
          <span>
            <strong>{completedExemptRequirements.length}</strong>
            {getText(language, 'readyCanWaitShort')}
          </span>
        </div>
      </section>

      {renderMissionSection(
        getText(language, 'missionQueue'),
        missionQueue,
        'requirement-mission-section--primary',
      )}
      {activeRequirements.length > 0 && (
        <section className="requirement-mission-section">
          <button
            className="requirement-section-heading requirement-section-heading--button"
            type="button"
            onClick={() => setIsActiveOpen((current) => !current)}
            aria-expanded={isActiveOpen}
          >
            <h4>{getText(language, 'activeRequirements')}</h4>
            <span>{activeRequirements.length}</span>
          </button>
          {isActiveOpen && (
            <div className="requirement-list">
              {activeRequirements.map((req) => renderRequirementCard(req))}
            </div>
          )}
        </section>
      )}
      {completedExemptRequirements.length > 0 && (
        <section className="requirement-mission-section">
          <button
            className="requirement-section-heading requirement-section-heading--button"
            type="button"
            onClick={() => setIsCompletedOpen((current) => !current)}
            aria-expanded={isCompletedOpen}
          >
            <h4>{getText(language, 'completedExempt')}</h4>
            <span>{completedExemptRequirements.length}</span>
          </button>
          {isCompletedOpen && (
            <div className="requirement-list">
              {completedExemptRequirements.map((req) => renderRequirementCard(req))}
            </div>
          )}
        </section>
      )}
    </section>
  )
}

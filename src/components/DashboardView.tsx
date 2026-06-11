import type { CSSProperties } from 'react'
import { ActionCenterPanel } from './ActionCenterPanel'
import { Badge } from './Badge'
import {
  getPriorityText,
  getStatusText,
  getText,
  getTrackStatusText,
  type Language,
} from '../i18n'
import type {
  CareerTrack,
  DocumentStatus,
  GuidanceSource,
  Priority,
  RequirementStatus,
  TrackMilestone,
} from '../types'
import {
  documentTone,
  priorityTone,
  requirementStatusTone,
  trackTone,
} from '../utils/display'
import { getRecommendationSet } from '../utils/recommendations'
import {
  calculateReadinessScore,
  getAvailableDocumentCount,
  getCompletedMilestoneCount,
  getCompletedRequirementCount,
  getCompletedTrainingCount,
  getNextMilestone,
} from '../utils/readiness'

interface DashboardViewProps {
  selectedTrack: CareerTrack
  isInteractive: boolean
  language: Language
  onReqStatusChange: (itemId: string, status: RequirementStatus) => void
  onDocStatusChange: (itemId: string, status: DocumentStatus) => void
  onMilestoneStatusChange: (
    itemId: string,
    status: TrackMilestone['status'],
  ) => void
  onOpenAnalysis: () => void
}

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

const MILESTONE_STATUSES: TrackMilestone['status'][] = [
  'Completed',
  'In Progress',
  'Upcoming',
]

function getMilestoneStatusText(
  language: Language,
  status: TrackMilestone['status'],
) {
  if (status === 'Upcoming') return getText(language, 'upcoming')
  return getStatusText(language, status)
}

function getMilestoneTone(status: TrackMilestone['status']) {
  if (status === 'Completed') return 'success'
  if (status === 'In Progress') return 'warning'
  return 'info'
}

function renderSourceDetails(source: GuidanceSource, language: Language) {
  return (
    <details className="inline-source-details">
      <summary>{getText(language, 'source')}</summary>
      <div className="source-attribution source-attribution--inline">
        <div>
          <span>{getText(language, 'source')}</span>
          {source.sourceUrl ? (
            <a href={source.sourceUrl} target="_blank" rel="noreferrer">
              {source.sourceName}
            </a>
          ) : (
            <strong>{source.sourceName}</strong>
          )}
        </div>
        <div>
          <span>{getText(language, 'sourceType')}</span>
          <strong>{source.sourceType}</strong>
        </div>
        <div>
          <span>{getText(language, 'lastReviewed')}</span>
          <strong>{source.lastReviewed ?? getText(language, 'notReviewed')}</strong>
        </div>
        {source.rationale && (
          <div>
            <span>{getText(language, 'sourceRationale')}</span>
            <strong>{source.rationale}</strong>
          </div>
        )}
      </div>
    </details>
  )
}

export function DashboardView({
  selectedTrack,
  isInteractive,
  language,
  onReqStatusChange,
  onDocStatusChange,
  onMilestoneStatusChange,
  onOpenAnalysis,
}: DashboardViewProps) {
  const readinessScore = calculateReadinessScore(selectedTrack)
  const nextMilestone = getNextMilestone(selectedTrack.milestones)
  const completedMilestones = getCompletedMilestoneCount(selectedTrack.milestones)
  const totalMilestones = selectedTrack.milestones.length
  const remainingMilestones = Math.max(0, totalMilestones - completedMilestones)
  const { nextActions } = getRecommendationSet(selectedTrack, 5, language)
  const missionAction = nextActions[0]
  const missionPriority = missionAction?.reason.priorityLevel as Priority | undefined

  let missionStatus: RequirementStatus | DocumentStatus | null = null
  if (missionAction?.itemType === 'requirement' && missionAction.itemId) {
    missionStatus =
      selectedTrack.requirements.find((r) => r.id === missionAction.itemId)?.status ??
      null
  } else if (missionAction?.itemType === 'document' && missionAction.itemId) {
    missionStatus =
      selectedTrack.documentChecklist.find((d) => d.id === missionAction.itemId)
        ?.status ?? null
  }

  return (
    <section className="screen-stack dashboard-stack">
      <article className="mission-card">
        <div className="mission-card-main">
          <div className="mission-kicker-row">
            <span className="mission-kicker">{getText(language, 'missionMode')}</span>
            <div className="badge-pair badge-pair--start">
              <Badge
                label={getTrackStatusText(language, selectedTrack.status)}
                tone={trackTone[selectedTrack.status]}
              />
              {selectedTrack.maturity === 'preview' && (
                <Badge label={getText(language, 'preview')} tone="neutral" />
              )}
            </div>
          </div>

          <div className="mission-title-row">
            <h3>{missionAction?.title ?? getText(language, 'noOpenActions')}</h3>
            {missionPriority && (
              <Badge
                label={getPriorityText(language, missionPriority)}
                tone={priorityTone[missionPriority]}
              />
            )}
          </div>

          <div className="mission-meta">
            <span>{selectedTrack.title}</span>
            {missionAction && (
              <span className="next-action-impact">
                +{missionAction.reason.scoreContributionPts}{' '}
                {getText(
                  language,
                  missionAction.reason.scoreContributionPts === 1
                    ? 'pointAbbrevSingular'
                    : 'pointAbbrev',
                )}{' '}
                {getText(language, 'readiness')}
              </span>
            )}
          </div>

          {missionAction && missionAction.itemId && missionStatus && (
            <div className="mission-control-row">
              <span className="status-control-label">{getText(language, 'status')}</span>
              {isInteractive ? (
                missionAction.itemType === 'requirement' ? (
                  <select
                    className="status-control mission-status-control"
                    value={missionStatus}
                    onChange={(e) =>
                      onReqStatusChange(
                        missionAction.itemId!,
                        e.target.value as RequirementStatus,
                      )
                    }
                    aria-label={`Status for ${missionAction.title}`}
                  >
                    {REQUIREMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {getStatusText(language, s)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    className="status-control mission-status-control"
                    value={missionStatus}
                    onChange={(e) =>
                      onDocStatusChange(
                        missionAction.itemId!,
                        e.target.value as DocumentStatus,
                      )
                    }
                    aria-label={`Status for ${missionAction.title}`}
                  >
                    {DOCUMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {getStatusText(language, s)}
                      </option>
                    ))}
                  </select>
                )
              ) : missionAction.itemType === 'requirement' ? (
                <Badge
                  label={getStatusText(language, missionStatus as RequirementStatus)}
                  tone={requirementStatusTone[missionStatus as RequirementStatus]}
                />
              ) : (
                <Badge
                  label={getStatusText(language, missionStatus as DocumentStatus)}
                  tone={documentTone[missionStatus as DocumentStatus]}
                />
              )}
            </div>
          )}
        </div>

        <div className="mission-score">
          <div
            className="score-ring score-ring--compact"
            style={{ '--score': `${readinessScore}%` } as CSSProperties}
            aria-label={`${readinessScore}% ${getText(language, 'readySuffix')}`}
          >
            <span>{readinessScore}%</span>
          </div>
          <div className="mission-score-copy">
            <span>{getText(language, 'readinessScore')}</span>
            <strong>
              {readinessScore}% {getText(language, 'readySuffix')}
            </strong>
          </div>
        </div>
      </article>

      <section
        className="readiness-snapshot"
        aria-label={getText(language, 'readinessSnapshot')}
      >
        <article className="metric-card readiness-snapshot-card">
          <span>{getText(language, 'readiness')}</span>
          <strong>{readinessScore}%</strong>
        </article>
        <article className="metric-card readiness-snapshot-card">
          <span>{getText(language, 'requirementsComplete')}</span>
          <strong>
            {getCompletedRequirementCount(selectedTrack.requirements)} /{' '}
            {selectedTrack.requirements.length}
          </strong>
        </article>
        <article className="metric-card readiness-snapshot-card">
          <span>{getText(language, 'trainingsComplete')}</span>
          <strong>
            {getCompletedTrainingCount(selectedTrack.trainingPlan)} /{' '}
            {selectedTrack.trainingPlan.length}
          </strong>
        </article>
        <article className="metric-card readiness-snapshot-card">
          <span>{getText(language, 'documentsAvailable')}</span>
          <strong>
            {getAvailableDocumentCount(selectedTrack.documentChecklist)} /{' '}
            {selectedTrack.documentChecklist.length}
          </strong>
        </article>
        <article className="metric-card readiness-snapshot-card">
          <span>{getText(language, 'milestonesComplete')}</span>
          <strong>
            {getCompletedMilestoneCount(selectedTrack.milestones)} /{' '}
            {selectedTrack.milestones.length}
          </strong>
          <p>{nextMilestone?.title ?? getText(language, 'noUpcomingMilestone')}</p>
        </article>
      </section>

      <article className="milestone-progress-panel">
        <div className="milestone-progress-header">
          <div>
            <span>{getText(language, 'milestoneProgress')}</span>
            <h3>
              {completedMilestones}/{totalMilestones}{' '}
              {getText(language, 'milestonesComplete')}
            </h3>
          </div>
          <Badge
            label={`${remainingMilestones} ${getText(language, 'remainingMilestones')}`}
            tone={remainingMilestones === 0 ? 'success' : 'warning'}
          />
        </div>

        <div className="milestone-progress-summary">
          <div>
            <span>{getText(language, 'nextMilestone')}</span>
            <strong>
              {nextMilestone?.title ?? getText(language, 'noUpcomingMilestone')}
            </strong>
            {nextMilestone && <p>{nextMilestone.targetDateLabel}</p>}
          </div>
          <p>{getText(language, 'milestonesAffectScore')}</p>
        </div>

        <div className="milestone-list">
          {selectedTrack.milestones.map((milestone) => (
            <div className="milestone-row" key={milestone.id}>
              <div className="milestone-row-main">
                <strong>{milestone.title}</strong>
                <span>{milestone.targetDateLabel}</span>
                {milestone.source && renderSourceDetails(milestone.source, language)}
              </div>
              {isInteractive ? (
                <select
                  className="status-control milestone-status-control"
                  data-status={milestone.status}
                  value={milestone.status}
                  onChange={(e) =>
                    onMilestoneStatusChange(
                      milestone.id,
                      e.target.value as TrackMilestone['status'],
                    )
                  }
                  aria-label={`${getText(language, 'milestoneStatus')}: ${
                    milestone.title
                  }`}
                >
                  {MILESTONE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {getMilestoneStatusText(language, status)}
                    </option>
                  ))}
                </select>
              ) : (
                <Badge
                  label={getMilestoneStatusText(language, milestone.status)}
                  tone={getMilestoneTone(milestone.status)}
                />
              )}
            </div>
          ))}
        </div>
      </article>

      <ActionCenterPanel
        selectedTrack={selectedTrack}
        isInteractive={isInteractive}
        language={language}
        onReqStatusChange={onReqStatusChange}
        onDocStatusChange={onDocStatusChange}
      />

      <article className="analysis-cta-panel">
        <div>
          <h3>{getText(language, 'analysisCenter')}</h3>
          <p>{getText(language, 'advancedAnalysisDescription')}</p>
        </div>
        <button className="analysis-cta-button" type="button" onClick={onOpenAnalysis}>
          {getText(language, 'viewAnalysis')}
        </button>
      </article>
    </section>
  )
}

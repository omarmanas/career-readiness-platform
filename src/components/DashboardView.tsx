import type { CSSProperties } from 'react'
import { ActionCenterPanel } from './ActionCenterPanel'
import { Badge } from './Badge'
import { CollapsibleSection } from './CollapsibleSection'
import { CompactMetricRow } from './CompactMetricRow'
import { DocumentIntelligencePanel } from './DocumentIntelligencePanel'
import { GapAnalysisPanel } from './GapAnalysisPanel'
import { ReadinessBreakdownCard } from './ReadinessBreakdownCard'
import { ReadinessNarrativePanel } from './ReadinessNarrativePanel'
import { RecruiterReadinessCard } from './RecruiterReadinessCard'
import { RequirementIntelligencePanel } from './RequirementIntelligencePanel'
import {
  getPriorityText,
  getStatusText,
  getText,
  getTrackStatusText,
  type Language,
} from '../i18n'
import type { CareerTrack, DocumentStatus, Priority, RequirementStatus } from '../types'
import {
  documentTone,
  priorityTone,
  readinessCategoryTone,
  requirementStatusTone,
  riskTone,
  trackTone,
} from '../utils/display'
import { getRecommendationSet } from '../utils/recommendations'
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
  isInteractive: boolean
  language: Language
  onReqStatusChange: (itemId: string, status: RequirementStatus) => void
  onDocStatusChange: (itemId: string, status: DocumentStatus) => void
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

export function DashboardView({
  selectedTrack,
  isInteractive,
  language,
  onReqStatusChange,
  onDocStatusChange,
}: DashboardViewProps) {
  const readinessScore = calculateReadinessScore(selectedTrack)
  const nextMilestone = getNextMilestone(selectedTrack.milestones)
  const topRiskFlags = getTopRiskFlags(selectedTrack.riskFlags)
  const priorityActions = getPriorityActions(selectedTrack)
  const readinessCategories = calculateReadinessCategories(selectedTrack)
  const readinessGaps = getTopReadinessGaps(selectedTrack)
  const trackHealth = getTrackHealthSummary(selectedTrack)
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

      <ActionCenterPanel
        selectedTrack={selectedTrack}
        isInteractive={isInteractive}
        language={language}
        onReqStatusChange={onReqStatusChange}
        onDocStatusChange={onDocStatusChange}
      />

      <CollapsibleSection
        title={getText(language, 'advancedAnalysis')}
        description={getText(language, 'advancedAnalysisDescription')}
      >
        <ReadinessBreakdownCard selectedTrack={selectedTrack} language={language} />

        {language === 'en' && (
          <div className="two-column">
            <ReadinessNarrativePanel selectedTrack={selectedTrack} language={language} />
            <RecruiterReadinessCard selectedTrack={selectedTrack} language={language} />
          </div>
        )}

        <RequirementIntelligencePanel
          selectedTrack={selectedTrack}
          language={language}
        />

        <section className="panel">
          <div className="section-heading">
            <h3>{getText(language, 'readinessCategories')}</h3>
            <span>{getText(language, 'calculatedScoring')}</span>
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
                <small>
                  {getText(language, 'target')} {category.targetScore}% -{' '}
                  {category.notes}
                </small>
              </article>
            ))}
          </div>
        </section>

        <div className="two-column">
          <article className="panel">
            <div className="section-heading">
              <h3>{getText(language, 'categoryGaps')}</h3>
              <span>{getText(language, 'targetShortfalls')}</span>
            </div>
            <div className="item-list">
              {readinessGaps.map((gap) => (
                <article className="list-row" key={gap.id}>
                  <div>
                    <strong>{gap.title}</strong>
                    <p>{gap.detail}</p>
                  </div>
                  <Badge
                    label={`${gap.gap} ${getText(language, 'pointGap')}`}
                    tone="warning"
                  />
                </article>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="section-heading">
              <h3>{getText(language, 'trackHealth')}</h3>
              <span>{getText(language, 'categorySummary')}</span>
            </div>
            <div className="health-grid">
              <div>
                <span>{getText(language, 'strongestArea')}</span>
                <strong>{trackHealth.strongestArea.name}</strong>
              </div>
              <div>
                <span>{getText(language, 'weakestArea')}</span>
                <strong>{trackHealth.weakestArea.name}</strong>
              </div>
              <div>
                <span>{getText(language, 'categoriesOnTarget')}</span>
                <strong>
                  {trackHealth.categoriesOnTarget}/{trackHealth.totalCategories}
                </strong>
              </div>
            </div>
          </article>
        </div>

        <GapAnalysisPanel selectedTrack={selectedTrack} language={language} />

        <div className="two-column">
          <DocumentIntelligencePanel
            selectedTrack={selectedTrack}
            language={language}
          />
          <article className="panel">
            <div className="section-heading">
              <h3>{getText(language, 'topRiskFlags')}</h3>
              <span>
                {topRiskFlags.length} {getText(language, 'shown')}
              </span>
            </div>
            <div className="item-list">
              {topRiskFlags.map((risk) => (
                <article className="list-row" key={risk.id}>
                  <div>
                    <strong>{risk.title}</strong>
                    <p>{risk.detail}</p>
                  </div>
                  <Badge
                    label={getPriorityText(language, risk.level)}
                    tone={riskTone[risk.level]}
                  />
                </article>
              ))}
            </div>
          </article>
        </div>

        <article className="panel">
          <div className="section-heading">
            <h3>{getText(language, 'supportingPriorityActions')}</h3>
            <span>{getText(language, 'traceabilityReference')}</span>
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
                  label={getPriorityText(language, action.priority)}
                  tone={priorityTone[action.priority]}
                />
              </article>
            ))}
          </div>
        </article>

        <CompactMetricRow selectedTrack={selectedTrack} language={language} />
      </CollapsibleSection>
    </section>
  )
}

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
import { getPriorityText, getText, getTrackStatusText, type Language } from '../i18n'
import type { CareerTrack, DocumentStatus, RequirementStatus } from '../types'
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
  isInteractive: boolean
  language: Language
  onReqStatusChange: (itemId: string, status: RequirementStatus) => void
  onDocStatusChange: (itemId: string, status: DocumentStatus) => void
}

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

  return (
    <section className="screen-stack dashboard-stack">
      <article className="summary-panel summary-panel--compact">
        <div className="summary-panel-main">
          <div className="badge-pair badge-pair--start">
            <Badge
              label={getTrackStatusText(language, selectedTrack.status)}
              tone={trackTone[selectedTrack.status]}
            />
            {selectedTrack.maturity === 'preview' && (
              <Badge label={getText(language, 'preview')} tone="neutral" />
            )}
          </div>
          <h3>{selectedTrack.title}</h3>
          <p>{selectedTrack.description}</p>
          <div className="meta-list meta-list--compact">
            <span>{selectedTrack.domain}</span>
            <span>{selectedTrack.market}</span>
            <span>{selectedTrack.targetRole}</span>
          </div>
        </div>
        <div className="summary-score-group">
          <div
            className="score-ring score-ring--compact"
            style={{ '--score': `${readinessScore}%` } as CSSProperties}
            aria-label={`${readinessScore}% ${getText(language, 'readySuffix')}`}
          >
            <span>{readinessScore}%</span>
          </div>
          <div className="summary-score-copy">
            <span>{getText(language, 'readinessScore')}</span>
            <strong>
              {readinessScore}% {getText(language, 'readySuffix')}
            </strong>
          </div>
        </div>
      </article>

      <section
        className="metric-grid metric-grid--compact"
        aria-label={getText(language, 'readinessWeighting')}
      >
        <article className="metric-card">
          <span>{getText(language, 'readiness')}</span>
          <strong>{readinessScore}%</strong>
          <p>{getText(language, 'weightedModel')}</p>
        </article>
        <article className="metric-card">
          <span>{getText(language, 'requirementsComplete')}</span>
          <strong>
            {getCompletedRequirementCount(selectedTrack.requirements)} /{' '}
            {selectedTrack.requirements.length}
          </strong>
          <p>40% {getText(language, 'weight')}</p>
        </article>
        <article className="metric-card">
          <span>{getText(language, 'trainingsComplete')}</span>
          <strong>
            {getCompletedTrainingCount(selectedTrack.trainingPlan)} /{' '}
            {selectedTrack.trainingPlan.length}
          </strong>
          <p>25% {getText(language, 'weight')}</p>
        </article>
        <article className="metric-card">
          <span>{getText(language, 'documentsAvailable')}</span>
          <strong>
            {getAvailableDocumentCount(selectedTrack.documentChecklist)} /{' '}
            {selectedTrack.documentChecklist.length}
          </strong>
          <p>20% {getText(language, 'weight')}</p>
        </article>
        <article className="metric-card">
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

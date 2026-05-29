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
import { getText, type Language } from '../i18n'
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
            <Badge label={selectedTrack.status} tone={trackTone[selectedTrack.status]} />
            {selectedTrack.maturity === 'preview' && (
              <Badge label="Preview" tone="neutral" />
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
            aria-label={`${readinessScore}% ready`}
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
        aria-label="Readiness weighting"
      >
        <article className="metric-card">
          <span>{getText(language, 'readiness')}</span>
          <strong>{readinessScore}%</strong>
          <p>Weighted model</p>
        </article>
        <article className="metric-card">
          <span>{getText(language, 'requirementsComplete')}</span>
          <strong>
            {getCompletedRequirementCount(selectedTrack.requirements)} /{' '}
            {selectedTrack.requirements.length}
          </strong>
          <p>40% weight</p>
        </article>
        <article className="metric-card">
          <span>{getText(language, 'trainingsComplete')}</span>
          <strong>
            {getCompletedTrainingCount(selectedTrack.trainingPlan)} /{' '}
            {selectedTrack.trainingPlan.length}
          </strong>
          <p>25% weight</p>
        </article>
        <article className="metric-card">
          <span>{getText(language, 'documentsAvailable')}</span>
          <strong>
            {getAvailableDocumentCount(selectedTrack.documentChecklist)} /{' '}
            {selectedTrack.documentChecklist.length}
          </strong>
          <p>20% weight</p>
        </article>
        <article className="metric-card">
          <span>{getText(language, 'milestonesComplete')}</span>
          <strong>
            {getCompletedMilestoneCount(selectedTrack.milestones)} /{' '}
            {selectedTrack.milestones.length}
          </strong>
          <p>{nextMilestone?.title ?? 'No upcoming milestone'}</p>
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

        <div className="two-column">
          <ReadinessNarrativePanel selectedTrack={selectedTrack} language={language} />
          <RecruiterReadinessCard selectedTrack={selectedTrack} language={language} />
        </div>

        <RequirementIntelligencePanel selectedTrack={selectedTrack} />

        <section className="panel">
          <div className="section-heading">
            <h3>Readiness categories</h3>
            <span>Calculated scoring</span>
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

        <div className="two-column">
          <article className="panel">
            <div className="section-heading">
              <h3>Category gaps</h3>
              <span>Target shortfalls</span>
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
                <span>Strongest area</span>
                <strong>{trackHealth.strongestArea.name}</strong>
              </div>
              <div>
                <span>Weakest area</span>
                <strong>{trackHealth.weakestArea.name}</strong>
              </div>
              <div>
                <span>Categories on target</span>
                <strong>
                  {trackHealth.categoriesOnTarget}/{trackHealth.totalCategories}
                </strong>
              </div>
            </div>
          </article>
        </div>

        <GapAnalysisPanel selectedTrack={selectedTrack} />

        <div className="two-column">
          <DocumentIntelligencePanel selectedTrack={selectedTrack} />
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
        </div>

        <article className="panel">
          <div className="section-heading">
            <h3>Supporting priority actions</h3>
            <span>Traceability reference</span>
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

        <CompactMetricRow selectedTrack={selectedTrack} />
      </CollapsibleSection>
    </section>
  )
}

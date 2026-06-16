import { Badge } from './Badge'
import { CompactMetricRow } from './CompactMetricRow'
import { DocumentIntelligencePanel } from './DocumentIntelligencePanel'
import { GapAnalysisPanel } from './GapAnalysisPanel'
import { ReadinessBreakdownCard } from './ReadinessBreakdownCard'
import { ReadinessNarrativePanel } from './ReadinessNarrativePanel'
import { RecruiterReadinessCard } from './RecruiterReadinessCard'
import { RequirementIntelligencePanel } from './RequirementIntelligencePanel'
import { getPriorityText, getText, type Language } from '../i18n'
import type { CareerTrack } from '../types'
import { readinessCategoryTone, riskTone, priorityTone } from '../utils/display'
import {
  calculateReadinessCategories,
  getPriorityActions,
  getTopReadinessGaps,
  getTopRiskFlags,
  getTrackHealthSummary,
} from '../utils/readiness'
import { getCategoryDisplayName } from '../utils/localizedDisplay'

interface AnalysisCenterViewProps {
  selectedTrack: CareerTrack
  language: Language
}

export function AnalysisCenterView({
  selectedTrack,
  language,
}: AnalysisCenterViewProps) {
  const topRiskFlags = getTopRiskFlags(selectedTrack.riskFlags)
  const priorityActions = getPriorityActions(selectedTrack)
  const readinessCategories = calculateReadinessCategories(selectedTrack)
  const readinessGaps = getTopReadinessGaps(selectedTrack)
  const trackHealth = getTrackHealthSummary(selectedTrack)

  return (
    <section className="screen-stack">
      <ReadinessBreakdownCard selectedTrack={selectedTrack} language={language} />

      {language === 'en' && (
        <div className="two-column">
          <ReadinessNarrativePanel selectedTrack={selectedTrack} language={language} />
          <RecruiterReadinessCard selectedTrack={selectedTrack} language={language} />
        </div>
      )}

      <RequirementIntelligencePanel selectedTrack={selectedTrack} language={language} />

      <section className="panel">
        <div className="section-heading">
          <h3>{getText(language, 'readinessCategories')}</h3>
          <span>{getText(language, 'calculatedScoring')}</span>
        </div>
        <div className="category-grid">
          {readinessCategories.map((category) => (
            <article className="category-card" key={category.id}>
              <div className="card-header">
                <strong>{getCategoryDisplayName(category.name, language)}</strong>
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
              <strong>
                {getCategoryDisplayName(trackHealth.strongestArea.name, language)}
              </strong>
            </div>
            <div>
              <span>{getText(language, 'weakestArea')}</span>
              <strong>
                {getCategoryDisplayName(trackHealth.weakestArea.name, language)}
              </strong>
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
        <DocumentIntelligencePanel selectedTrack={selectedTrack} language={language} />
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
    </section>
  )
}

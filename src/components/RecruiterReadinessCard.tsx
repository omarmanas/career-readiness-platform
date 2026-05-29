import type { CareerTrack } from '../types'
import { getText, type Language } from '../i18n'
import { getRecruiterReadiness } from '../utils/intelligence'

interface RecruiterReadinessCardProps {
  selectedTrack: CareerTrack
  language: Language
}

export function RecruiterReadinessCard({
  selectedTrack,
  language,
}: RecruiterReadinessCardProps) {
  const { readyItems, needsAttentionItems, overallReady } = getRecruiterReadiness(selectedTrack)

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>{getText(language, 'recruiterReadiness')}</h3>
        <span style={{ color: overallReady ? '#86efac' : '#fcd34d' }}>
          {overallReady
            ? getText(language, 'onTrack')
            : `${needsAttentionItems.length} ${getText(language, 'items')}`}
        </span>
      </div>

      <div className="recruiter-readiness-grid">
        <div>
          <p className="intel-subheading intel-subheading--ready">
            {getText(language, 'ready')}
          </p>
          {readyItems.length === 0 ? (
            <p className="intel-empty">
              {getText(language, 'noItemsConfirmedYet')}
            </p>
          ) : (
            <ul className="check-list">
              {readyItems.map((item) => (
                <li className="check-item check-item--ready" key={item}>
                  <span className="check-icon" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="intel-subheading intel-subheading--attention">
            {getText(language, 'needsAttention')}
          </p>
          {needsAttentionItems.length === 0 ? (
            <p className="intel-empty" style={{ color: '#86efac' }}>
              {getText(language, 'allItemsOnTrack')}
            </p>
          ) : (
            <ul className="check-list">
              {needsAttentionItems.map((item) => (
                <li className="check-item check-item--attention" key={item}>
                  <span className="check-icon" aria-hidden="true">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  )
}

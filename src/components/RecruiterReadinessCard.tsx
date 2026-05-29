import type { CareerTrack } from '../types'
import { getRecruiterReadiness } from '../utils/intelligence'

interface RecruiterReadinessCardProps {
  selectedTrack: CareerTrack
}

export function RecruiterReadinessCard({ selectedTrack }: RecruiterReadinessCardProps) {
  const { readyItems, needsAttentionItems, overallReady } = getRecruiterReadiness(selectedTrack)

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>Recruiter Readiness</h3>
        <span style={{ color: overallReady ? '#86efac' : '#fcd34d' }}>
          {overallReady ? 'On track' : `${needsAttentionItems.length} items`}
        </span>
      </div>

      <div className="recruiter-readiness-grid">
        <div>
          <p className="intel-subheading intel-subheading--ready">Ready</p>
          {readyItems.length === 0 ? (
            <p className="intel-empty">No items confirmed yet.</p>
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
          <p className="intel-subheading intel-subheading--attention">Needs attention</p>
          {needsAttentionItems.length === 0 ? (
            <p className="intel-empty" style={{ color: '#86efac' }}>All items on track.</p>
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

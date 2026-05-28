import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { trackTone } from '../utils/display'
import {
  calculateReadinessScore,
  getTopReadinessCategories,
  getTopRiskFlags,
} from '../utils/readiness'

interface CareerTracksViewProps {
  careerTracks: CareerTrack[]
}

export function CareerTracksView({ careerTracks }: CareerTracksViewProps) {
  return (
    <section className="card-grid">
      {careerTracks.map((track) => {
        const readinessScore = calculateReadinessScore(track)
        const topRiskFlag = getTopRiskFlags(track.riskFlags, 1)[0]
        const topCategories = getTopReadinessCategories(track)

        return (
          <article className="track-card" key={track.id}>
            <div className="card-header">
              <Badge label={track.status} tone={trackTone[track.status]} />
              <strong>{readinessScore}%</strong>
            </div>
            <h3>{track.title}</h3>
            <p>{track.targetRole}</p>
            <dl className="track-facts">
              <div>
                <dt>Domain</dt>
                <dd>{track.domain}</dd>
              </div>
              <div>
                <dt>Market</dt>
                <dd>{track.market}</dd>
              </div>
              <div>
                <dt>Top risk</dt>
                <dd>{topRiskFlag?.title ?? 'None'}</dd>
              </div>
            </dl>
            <div>
              <h4 className="mini-heading">Readiness Breakdown</h4>
              <div className="breakdown-list">
                {topCategories.map((category) => (
                  <div className="breakdown-row" key={category.id}>
                    <span>{category.name}</span>
                    <strong>{category.score}%</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="progress-bar" aria-hidden="true">
              <span style={{ width: `${readinessScore}%` }} />
            </div>
          </article>
        )
      })}
    </section>
  )
}

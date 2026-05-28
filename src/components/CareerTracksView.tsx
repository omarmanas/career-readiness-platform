import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { trackTone } from '../utils/display'
import {
  calculateReadinessScore,
  getTopReadinessCategories,
} from '../utils/readiness'
import { generateNextActions, getImmediateAction } from '../utils/actions'
import { getTopUnresolvedGap } from '../utils/gaps'

interface CareerTracksViewProps {
  careerTracks: CareerTrack[]
}

export function CareerTracksView({ careerTracks }: CareerTracksViewProps) {
  return (
    <section className="card-grid">
      {careerTracks.map((track) => {
        const readinessScore = calculateReadinessScore(track)
        const topUnresolvedGap = getTopUnresolvedGap(track)
        const immediateAction = getImmediateAction(track)
        const actionQueueCount = generateNextActions(track).filter(
          (action) => action.status !== 'Completed' && action.status !== 'Deferred',
        ).length
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
                <dt>Top unresolved gap</dt>
                <dd>{topUnresolvedGap?.title ?? 'None'}</dd>
              </div>
              <div>
                <dt>Immediate action</dt>
                <dd>{immediateAction?.title ?? 'None'}</dd>
              </div>
              <div>
                <dt>Action queue count</dt>
                <dd>{actionQueueCount}</dd>
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

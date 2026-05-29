import { useState } from 'react'
import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { trackTone } from '../utils/display'
import {
  calculateReadinessScore,
  getTopReadinessCategories,
} from '../utils/readiness'
import { generateNextActions, getImmediateAction } from '../utils/actions'
import { getTopGaps, getTopUnresolvedGap } from '../utils/gaps'

interface CareerTracksViewProps {
  careerTracks: CareerTrack[]
  selectedTrackId: string
  onSelectTrack: (trackId: string) => void
}

export function CareerTracksView({
  careerTracks,
  selectedTrackId,
  onSelectTrack,
}: CareerTracksViewProps) {
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null)

  return (
    <section className="card-grid track-selection-grid">
      {careerTracks.map((track) => {
        const readinessScore = calculateReadinessScore(track)
        const topUnresolvedGap = getTopUnresolvedGap(track)
        const immediateAction = getImmediateAction(track)
        const actionQueueCount = generateNextActions(track).filter(
          (action) => action.status !== 'Completed' && action.status !== 'Deferred',
        ).length
        const topCategories = getTopReadinessCategories(track)
        const topGap = getTopGaps(track, 1)[0]
        const isSelected = track.id === selectedTrackId
        const isExpanded = track.id === expandedTrackId

        return (
          <article
            className={isSelected ? 'track-card selected' : 'track-card'}
            key={track.id}
            onClick={() => onSelectTrack(track.id)}
          >
            <div className="track-card-top">
              <Badge label={track.status} tone={trackTone[track.status]} />
              <strong>{readinessScore}%</strong>
            </div>
            <div>
              <h3>{track.title}</h3>
              <p>{track.targetRole}</p>
            </div>
            <dl className="track-facts compact">
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
            </dl>
            <div className="progress-bar" aria-hidden="true">
              <span style={{ width: `${readinessScore}%` }} />
            </div>
            <button
              className="track-detail-toggle"
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setExpandedTrackId(isExpanded ? null : track.id)
                onSelectTrack(track.id)
              }}
              aria-expanded={isExpanded}
            >
              {isExpanded ? 'Hide details' : 'Show details'}
            </button>
            {isExpanded && (
              <div className="track-card-details">
                <div>
                  <h4 className="mini-heading">Top Categories</h4>
                  <div className="breakdown-list">
                    {topCategories.map((category) => (
                      <div className="breakdown-row" key={category.id}>
                        <span>{category.name}</span>
                        <strong>{category.score}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="track-detail-row">
                  <span>Action queue count</span>
                  <strong>{actionQueueCount}</strong>
                </div>
                <div className="track-detail-row">
                  <span>Top gap details</span>
                  <strong>{topGap?.reason ?? 'No open gap details'}</strong>
                </div>
                <p className="track-source-note">
                  Verify with official source. Demo requirements are not final.
                </p>
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}

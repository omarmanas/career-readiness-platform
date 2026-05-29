import { Badge } from './Badge'
import type { CareerTrack, RiskFlag } from '../types'
import { trackTone } from '../utils/display'
import {
  calculateReadinessScore,
  getTopReadinessCategories,
  getTopRiskFlags,
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
  const selectedTrack =
    careerTracks.find((t) => t.id === selectedTrackId) ?? careerTracks[0]

  return (
    <div className="track-master-detail">
      <nav className="track-list-panel" aria-label="Career tracks">
        {careerTracks.map((track) => {
          const score = calculateReadinessScore(track)
          const isSelected = track.id === selectedTrackId
          const isPreview = track.maturity === 'preview'

          return (
            <button
              key={track.id}
              type="button"
              className={`track-list-item${isSelected ? ' selected' : ''}`}
              onClick={() => onSelectTrack(track.id)}
              aria-pressed={isSelected}
            >
              <span className="track-list-name">{track.title}</span>
              <span className="track-list-meta">
                {isPreview && <Badge label="Preview" tone="neutral" />}
                <Badge label={track.status} tone={trackTone[track.status]} />
                <strong className="track-list-score">{score}%</strong>
              </span>
            </button>
          )
        })}
      </nav>

      {selectedTrack && <TrackDetailPanel track={selectedTrack} />}
    </div>
  )
}

function riskTone(level: RiskFlag['level']): 'danger' | 'warning' | 'neutral' {
  if (level === 'Critical' || level === 'High') return level === 'Critical' ? 'danger' : 'warning'
  return 'neutral'
}

function gapSeverityTone(severity: string): 'danger' | 'warning' | 'neutral' {
  if (severity === 'Critical') return 'danger'
  if (severity === 'High') return 'warning'
  return 'neutral'
}

function TrackDetailPanel({ track }: { track: CareerTrack }) {
  const readinessScore = calculateReadinessScore(track)
  const topUnresolvedGap = getTopUnresolvedGap(track)
  const immediateAction = getImmediateAction(track)
  const topCategories = getTopReadinessCategories(track)
  const topGaps = getTopGaps(track, 3)
  const riskFlags = getTopRiskFlags(track.riskFlags, 3)
  const actionQueueCount = generateNextActions(track).filter(
    (a) => a.status !== 'Completed' && a.status !== 'Deferred',
  ).length
  const isPreview = track.maturity === 'preview'

  return (
    <div className="track-detail-panel">
      {isPreview && (
        <div className="preview-banner" role="note">
          Preview track — placeholder data, not yet validated.
        </div>
      )}

      <div className="track-detail-header">
        <div className="track-detail-title-row">
          <Badge label={track.status} tone={trackTone[track.status]} />
          {isPreview && <Badge label="Preview" tone="neutral" />}
          <h3 className="track-detail-title">{track.title}</h3>
        </div>
        {track.description && (
          <p className="track-detail-description">{track.description}</p>
        )}
      </div>

      <div className="track-detail-meta-row">
        <div>
          <span>Domain</span>
          <strong>{track.domain}</strong>
        </div>
        <div>
          <span>Market</span>
          <strong>{track.market}</strong>
        </div>
        <div>
          <span>Target role</span>
          <strong>{track.targetRole}</strong>
        </div>
        <div>
          <span>Action queue</span>
          <strong>{actionQueueCount}</strong>
        </div>
      </div>

      <div className="track-detail-readiness">
        <div className="track-detail-score-row">
          <span className="track-detail-score-label">Overall readiness</span>
          <strong className="track-detail-score-number">{readinessScore}%</strong>
        </div>
        <div className="progress-bar" aria-hidden="true">
          <span style={{ width: `${readinessScore}%` }} />
        </div>
      </div>

      <div className="track-detail-body">
        <div className="track-detail-col">
          <h4 className="mini-heading">Top readiness categories</h4>
          <div className="breakdown-list">
            {topCategories.map((category) => (
              <div className="breakdown-row" key={category.id}>
                <span>{category.name}</span>
                <strong>{category.score}%</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="track-detail-col">
          <h4 className="mini-heading">Gap summary</h4>
          <div className="breakdown-list">
            {topGaps.length > 0 ? (
              topGaps.map((gap) => (
                <div className="breakdown-row" key={gap.id}>
                  <span>{gap.title}</span>
                  <Badge
                    label={gap.severity}
                    tone={gapSeverityTone(gap.severity)}
                  />
                </div>
              ))
            ) : (
              <span className="track-detail-empty">No open gaps</span>
            )}
          </div>
        </div>
      </div>

      <div className="track-detail-actions">
        <div className="track-detail-action-item">
          <h4 className="mini-heading">Immediate action</h4>
          <strong>{immediateAction?.title ?? 'None'}</strong>
          {immediateAction?.description && (
            <p>{immediateAction.description}</p>
          )}
        </div>

        <div className="track-detail-action-item">
          <h4 className="mini-heading">Top unresolved gap</h4>
          <strong>{topUnresolvedGap?.title ?? 'None'}</strong>
          {topUnresolvedGap?.reason && <p>{topUnresolvedGap.reason}</p>}
        </div>
      </div>

      {riskFlags.length > 0 && (
        <div className="track-detail-risks">
          <h4 className="mini-heading">Risk indicators</h4>
          <div className="breakdown-list">
            {riskFlags.map((flag) => (
              <div className="breakdown-row" key={flag.id}>
                <span>{flag.title}</span>
                <Badge label={flag.level} tone={riskTone(flag.level)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="track-source-note">
        Verify with official source and recruiter. Requirements may change.
      </p>
    </div>
  )
}

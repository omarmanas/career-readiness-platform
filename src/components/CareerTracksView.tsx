import { Badge } from './Badge'
import { getPriorityText, getText, getTrackStatusText, type Language } from '../i18n'
import type { CareerTrack, RiskFlag } from '../types'
import { trackTone } from '../utils/display'
import {
  calculateReadinessScore,
  getTopReadinessCategories,
  getTopRiskFlags,
} from '../utils/readiness'
import { generateNextActions, getImmediateAction } from '../utils/actions'
import { getTopGaps, getTopUnresolvedGap } from '../utils/gaps'
import {
  getCategoryDisplayName,
  getTrackDisplayName,
} from '../utils/localizedDisplay'

interface CareerTracksViewProps {
  careerTracks: CareerTrack[]
  language: Language
  selectedTrackId: string
  onSelectTrack: (trackId: string) => void
}

export function CareerTracksView({
  careerTracks,
  language,
  selectedTrackId,
  onSelectTrack,
}: CareerTracksViewProps) {
  const selectedTrack =
    careerTracks.find((t) => t.id === selectedTrackId) ?? careerTracks[0]

  return (
    <div className="track-master-detail">
      <nav className="track-list-panel" aria-label={getText(language, 'careerTracksAria')}>
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
              <span className="track-list-name">
                {getTrackDisplayName(track, language)}
              </span>
              <div className="progress-bar progress-bar--mini" aria-hidden="true">
                <span style={{ width: `${score}%` }} />
              </div>
              <span className="track-list-meta">
                {isPreview && (
                  <Badge label={getText(language, 'preview')} tone="neutral" />
                )}
                <Badge
                  label={getTrackStatusText(language, track.status)}
                  tone={trackTone[track.status]}
                />
                <strong className="track-list-score">{score}%</strong>
              </span>
            </button>
          )
        })}
      </nav>

      {selectedTrack && (
        <TrackDetailPanel track={selectedTrack} language={language} />
      )}
    </div>
  )
}

function riskTone(level: RiskFlag['level']): 'danger' | 'warning' | 'neutral' {
  if (level === 'Critical' || level === 'High') {
    return level === 'Critical' ? 'danger' : 'warning'
  }
  return 'neutral'
}

function gapSeverityTone(severity: string): 'danger' | 'warning' | 'neutral' {
  if (severity === 'Critical') return 'danger'
  if (severity === 'High') return 'warning'
  return 'neutral'
}

function TrackDetailPanel({
  track,
  language,
}: {
  track: CareerTrack
  language: Language
}) {
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
          {getText(language, 'previewTrack')} -{' '}
          {getText(language, 'placeholderData')},{' '}
          {getText(language, 'notYetValidated')}.
        </div>
      )}

      <div className="track-detail-header">
        <div className="track-detail-title-row">
          <Badge
            label={getTrackStatusText(language, track.status)}
            tone={trackTone[track.status]}
          />
          {isPreview && (
            <Badge label={getText(language, 'preview')} tone="neutral" />
          )}
          <h3 className="track-detail-title">
            {getTrackDisplayName(track, language)}
          </h3>
        </div>
        {track.description && (
          <p className="track-detail-description">{track.description}</p>
        )}
      </div>

      <div className="track-detail-meta-row">
        <div>
          <span>{getText(language, 'domain')}</span>
          <strong>{track.domain}</strong>
        </div>
        <div>
          <span>{getText(language, 'market')}</span>
          <strong>{track.market}</strong>
        </div>
        <div>
          <span>{getText(language, 'targetRole')}</span>
          <strong>{track.targetRole}</strong>
        </div>
        <div>
          <span>{getText(language, 'actionQueue')}</span>
          <strong>{actionQueueCount}</strong>
        </div>
      </div>

      <div className="track-detail-readiness">
        <div className="track-detail-score-row">
          <span className="track-detail-score-label">
            {getText(language, 'readiness')}
          </span>
          <strong className="track-detail-score-number">{readinessScore}%</strong>
        </div>
        <div className="progress-bar" aria-hidden="true">
          <span style={{ width: `${readinessScore}%` }} />
        </div>
      </div>

      <div className="track-detail-body">
        <div className="track-detail-col">
          <h4 className="mini-heading">
            {getText(language, 'topReadinessCategories')}
          </h4>
          <div className="breakdown-list">
            {topCategories.map((category) => (
              <div className="breakdown-row" key={category.id}>
                <span>{getCategoryDisplayName(category.name, language)}</span>
                <strong>{category.score}%</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="track-detail-col">
          <h4 className="mini-heading">{getText(language, 'gapSummary')}</h4>
          <div className="breakdown-list">
            {topGaps.length > 0 ? (
              topGaps.map((gap) => (
                <div className="breakdown-row" key={gap.id}>
                  <span>{gap.title}</span>
                  <Badge
                    label={getPriorityText(language, gap.severity)}
                    tone={gapSeverityTone(gap.severity)}
                  />
                </div>
              ))
            ) : (
              <span className="track-detail-empty">
                {getText(language, 'noOpenGaps')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="track-detail-actions">
        <div className="track-detail-action-item">
          <h4 className="mini-heading">{getText(language, 'immediateAction')}</h4>
          <strong>{immediateAction?.title ?? getText(language, 'none')}</strong>
          {immediateAction?.description && (
            <p>{immediateAction.description}</p>
          )}
        </div>

        <div className="track-detail-action-item">
          <h4 className="mini-heading">{getText(language, 'topUnresolvedGap')}</h4>
          <strong>{topUnresolvedGap?.title ?? getText(language, 'none')}</strong>
          {topUnresolvedGap?.reason && <p>{topUnresolvedGap.reason}</p>}
        </div>
      </div>

      {riskFlags.length > 0 && (
        <div className="track-detail-risks">
          <h4 className="mini-heading">{getText(language, 'riskIndicators')}</h4>
          <div className="breakdown-list">
            {riskFlags.map((flag) => (
              <div className="breakdown-row" key={flag.id}>
                <span>{flag.title}</span>
                <Badge
                  label={getPriorityText(language, flag.level)}
                  tone={riskTone(flag.level)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="track-source-note">
        {getText(language, 'verifyOfficialSourceRecruiter')}.{' '}
        {getText(language, 'requirementsMayChange')}.
      </p>
    </div>
  )
}

import { Badge } from './Badge'
import {
  getPriorityText,
  getStatusText,
  getText,
  type Language,
} from '../i18n'
import type { CareerTrack, GuidanceSource, TrainingStatus } from '../types'
import { priorityTone, trainingTone } from '../utils/display'

const TRAINING_STATUSES: TrainingStatus[] = [
  'Planned',
  'In Progress',
  'Completed',
  'Pending',
  'Deferred',
]

function renderSourceSection(source: GuidanceSource | undefined, language: Language) {
  if (!source) {
    return <p className="detail-muted-note">{getText(language, 'noSourceMetadata')}</p>
  }

  return (
    <div className="source-attribution source-attribution--inline">
      <div>
        <span>{getText(language, 'sourceType')}</span>
        <strong>{source.sourceType}</strong>
      </div>
      <div>
        <span>{getText(language, 'sourceName')}</span>
        <strong>{source.sourceName}</strong>
      </div>
      <div>
        <span>{getText(language, 'sourceUrl')}</span>
        {source.sourceUrl ? (
          <a href={source.sourceUrl} target="_blank" rel="noreferrer">
            {getText(language, 'verifySource')}
          </a>
        ) : (
          <strong>{getText(language, 'notSpecified')}</strong>
        )}
      </div>
      <div>
        <span>{getText(language, 'lastReviewed')}</span>
        <strong>{source.lastReviewed ?? getText(language, 'notReviewed')}</strong>
      </div>
      <div>
        <span>{getText(language, 'rationale')}</span>
        <strong>{source.rationale ?? getText(language, 'notSpecified')}</strong>
      </div>
    </div>
  )
}

interface TrainingTrackerViewProps {
  selectedTrack: CareerTrack
  isInteractive: boolean
  language: Language
  onStatusChange: (itemId: string, status: TrainingStatus) => void
}

export function TrainingTrackerView({
  selectedTrack,
  isInteractive,
  language,
  onStatusChange,
}: TrainingTrackerViewProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h3>{getText(language, 'trainingTracker')}</h3>
        <span>{selectedTrack.title}</span>
      </div>
      <div className="data-table">
        {selectedTrack.trainingPlan.map((item) => (
          <article className="table-row training-table-row" key={item.id}>
            <div>
              <strong>{item.title}</strong>
              <p>{item.category}</p>
              <details className="inline-source-details">
                <summary>{getText(language, 'details')}</summary>
                <div className="inline-detail-sections">
                  <section className="detail-section">
                    <h5>{getText(language, 'whyThisMatters')}</h5>
                    <p>{item.category}</p>
                  </section>
                  <section className="detail-section">
                    <h5>{getText(language, 'source')}</h5>
                    {renderSourceSection(item.source, language)}
                  </section>
                  <section className="detail-section">
                    <h5>{getText(language, 'verificationEvidence')}</h5>
                    <div className="document-detail-grid">
                      <div>
                        <span>{getText(language, 'category')}</span>
                        <strong>{item.category}</strong>
                      </div>
                      <div>
                        <span>{getText(language, 'priority')}</span>
                        <strong>{getPriorityText(language, item.priority)}</strong>
                      </div>
                      <div>
                        <span>{getText(language, 'status')}</span>
                        <strong>{getStatusText(language, item.status)}</strong>
                      </div>
                      <div>
                        <span>{getText(language, 'target')}</span>
                        <strong>{item.dueLabel}</strong>
                      </div>
                    </div>
                  </section>
                </div>
              </details>
            </div>
            <span>{item.dueLabel}</span>
            <Badge
              label={getPriorityText(language, item.priority)}
              tone={priorityTone[item.priority]}
            />
            {isInteractive ? (
              <select
                className="status-control"
                value={item.status}
                onChange={(e) =>
                  onStatusChange(item.id, e.target.value as TrainingStatus)
                }
                aria-label={`Status for ${item.title}`}
              >
                {TRAINING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {getStatusText(language, s)}
                  </option>
                ))}
              </select>
            ) : (
              <Badge
                label={getStatusText(language, item.status)}
                tone={trainingTone[item.status]}
              />
            )}
          </article>
        ))}
      </div>
      {!isInteractive && (
        <p className="status-control-note">
          {getText(language, 'readOnlyPreviewNote')}
        </p>
      )}
    </section>
  )
}

import { Badge } from './Badge'
import {
  getPriorityText,
  getStatusText,
  getText,
  type Language,
} from '../i18n'
import type { CareerTrack, TrainingStatus } from '../types'
import { priorityTone, trainingTone } from '../utils/display'

const TRAINING_STATUSES: TrainingStatus[] = [
  'Planned',
  'In Progress',
  'Completed',
  'Pending',
  'Deferred',
]

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

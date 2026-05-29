import { Badge } from './Badge'
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
  onStatusChange: (itemId: string, status: TrainingStatus) => void
}

export function TrainingTrackerView({
  selectedTrack,
  isInteractive,
  onStatusChange,
}: TrainingTrackerViewProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h3>Training tracker</h3>
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
            <Badge label={item.priority} tone={priorityTone[item.priority]} />
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
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <Badge label={item.status} tone={trainingTone[item.status]} />
            )}
          </article>
        ))}
      </div>
      {!isInteractive && (
        <p className="status-control-note">
          Status controls are read-only for preview tracks.
        </p>
      )}
    </section>
  )
}

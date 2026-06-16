import { useState } from 'react'
import { Badge } from './Badge'
import {
  getPriorityText,
  getStatusText,
  getText,
  type Language,
} from '../i18n'
import type { CareerTrack, Priority, TrainingItem, TrainingStatus } from '../types'
import { priorityTone, trainingTone } from '../utils/display'
import { getCategoryDisplayName } from '../utils/localizedDisplay'

const TRAINING_STATUSES: TrainingStatus[] = [
  'Planned',
  'In Progress',
  'Completed',
  'Pending',
  'Deferred',
]

const STATUS_TIER: Record<TrainingStatus, number> = {
  'In Progress': 0,
  Planned: 1,
  Pending: 2,
  Deferred: 3,
  Completed: 4,
}

const PRIORITY_RANK: Record<Priority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

function sortByUrgency(items: TrainingItem[]): TrainingItem[] {
  return [...items].sort((a, b) => {
    const tierDiff = STATUS_TIER[a.status] - STATUS_TIER[b.status]
    if (tierDiff !== 0) return tierDiff
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  })
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
  const [isCompletedOpen, setIsCompletedOpen] = useState(false)

  const sorted = sortByUrgency(selectedTrack.trainingPlan)
  const activeItems = sorted.filter((item) => item.status !== 'Completed')
  const completedItems = sorted.filter((item) => item.status === 'Completed')

  function renderTrainingRow(item: TrainingItem) {
    return (
      <article className="table-row training-table-row" key={item.id}>
        <div>
          <strong>{item.title}</strong>
          <p>{getCategoryDisplayName(item.category, language)}</p>
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
    )
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h3>{getText(language, 'trainingTracker')}</h3>
      </div>

      {activeItems.length === 0 ? (
        <p className="detail-muted-note">
          {getText(language, 'allTrainingsComplete')}
        </p>
      ) : (
        <section className="requirement-mission-section">
          <div className="requirement-section-heading">
            <h4>{getText(language, 'activeTraining')}</h4>
            <span>{activeItems.length}</span>
          </div>
          <div className="data-table">
            {activeItems.map((item) => renderTrainingRow(item))}
          </div>
        </section>
      )}

      {completedItems.length > 0 && (
        <section className="requirement-mission-section">
          <button
            className="requirement-section-heading requirement-section-heading--button"
            type="button"
            onClick={() => setIsCompletedOpen((prev) => !prev)}
            aria-expanded={isCompletedOpen}
          >
            <h4>{getText(language, 'completedTraining')}</h4>
            <span>{completedItems.length}</span>
          </button>
          {isCompletedOpen && (
            <div className="data-table completed-section-list">
              {completedItems.map((item) => renderTrainingRow(item))}
            </div>
          )}
        </section>
      )}

      {!isInteractive && (
        <p className="status-control-note">
          {getText(language, 'readOnlyPreviewNote')}
        </p>
      )}
    </section>
  )
}

import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { priorityTone, trainingTone } from '../utils/display'

interface TrainingTrackerViewProps {
  selectedTrack: CareerTrack
}

export function TrainingTrackerView({ selectedTrack }: TrainingTrackerViewProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h3>Training tracker</h3>
        <span>{selectedTrack.title}</span>
      </div>
      <div className="data-table">
        {selectedTrack.trainingPlan.map((item) => (
          <article className="table-row" key={item.id}>
            <div>
              <strong>{item.title}</strong>
              <p>{item.category}</p>
            </div>
            <span>{item.dueLabel}</span>
            <Badge label={item.status} tone={trainingTone[item.status]} />
            <Badge label={item.priority} tone={priorityTone[item.priority]} />
          </article>
        ))}
      </div>
    </section>
  )
}

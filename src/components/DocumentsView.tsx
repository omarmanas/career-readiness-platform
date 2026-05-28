import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { documentTone } from '../utils/display'

interface DocumentsViewProps {
  selectedTrack: CareerTrack
}

export function DocumentsView({ selectedTrack }: DocumentsViewProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h3>Document inventory</h3>
        <span>No uploads or real links</span>
      </div>
      <div className="data-table">
        {selectedTrack.documentChecklist.map((item) => (
          <article className="table-row document-row" key={item.id}>
            <div>
              <strong>{item.title}</strong>
              <p>{item.label}</p>
            </div>
            <span>{item.category}</span>
            <Badge label={item.status} tone={documentTone[item.status]} />
          </article>
        ))}
      </div>
    </section>
  )
}

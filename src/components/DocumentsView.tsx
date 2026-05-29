import { DocumentInventoryView } from './DocumentInventoryView'
import { DocumentSummaryPanel } from './DocumentSummaryPanel'
import type { CareerTrack } from '../types'

interface DocumentsViewProps {
  selectedTrack: CareerTrack
}

export function DocumentsView({ selectedTrack }: DocumentsViewProps) {
  return (
    <section className="screen-stack">
      <DocumentSummaryPanel selectedTrack={selectedTrack} />
      <DocumentInventoryView selectedTrack={selectedTrack} />
    </section>
  )
}

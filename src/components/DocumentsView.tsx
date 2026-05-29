import { DocumentInventoryView } from './DocumentInventoryView'
import { DocumentSummaryPanel } from './DocumentSummaryPanel'
import type { CareerTrack, DocumentStatus } from '../types'

interface DocumentsViewProps {
  selectedTrack: CareerTrack
  isInteractive: boolean
  onStatusChange: (itemId: string, status: DocumentStatus) => void
}

export function DocumentsView({
  selectedTrack,
  isInteractive,
  onStatusChange,
}: DocumentsViewProps) {
  return (
    <section className="screen-stack">
      <DocumentSummaryPanel selectedTrack={selectedTrack} />
      <DocumentInventoryView
        selectedTrack={selectedTrack}
        isInteractive={isInteractive}
        onStatusChange={onStatusChange}
      />
    </section>
  )
}

import { DocumentInventoryView } from './DocumentInventoryView'
import { DocumentSummaryPanel } from './DocumentSummaryPanel'
import type { Language } from '../i18n'
import type { CareerTrack, DocumentStatus } from '../types'

interface DocumentsViewProps {
  selectedTrack: CareerTrack
  isInteractive: boolean
  language: Language
  onStatusChange: (itemId: string, status: DocumentStatus) => void
}

export function DocumentsView({
  selectedTrack,
  isInteractive,
  language,
  onStatusChange,
}: DocumentsViewProps) {
  return (
    <section className="screen-stack">
      <DocumentSummaryPanel selectedTrack={selectedTrack} />
      <DocumentInventoryView
        selectedTrack={selectedTrack}
        isInteractive={isInteractive}
        language={language}
        onStatusChange={onStatusChange}
      />
    </section>
  )
}

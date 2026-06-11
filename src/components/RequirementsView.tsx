import { RequirementInventoryView } from './RequirementInventoryView'
import { RequirementSummaryPanel } from './RequirementSummaryPanel'
import type { Language } from '../i18n'
import type { CareerTrack, RequirementStatus } from '../types'

interface RequirementsViewProps {
  selectedTrack: CareerTrack
  isInteractive: boolean
  language: Language
  onStatusChange: (itemId: string, status: RequirementStatus) => void
}

export function RequirementsView({
  selectedTrack,
  isInteractive,
  language,
  onStatusChange,
}: RequirementsViewProps) {
  return (
    <section className="screen-stack">
      <RequirementSummaryPanel selectedTrack={selectedTrack} language={language} />
      <RequirementInventoryView
        selectedTrack={selectedTrack}
        isInteractive={isInteractive}
        language={language}
        onStatusChange={onStatusChange}
      />
    </section>
  )
}

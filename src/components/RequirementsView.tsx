import { RequirementInventoryView } from './RequirementInventoryView'
import { RequirementSummaryPanel } from './RequirementSummaryPanel'
import type { CareerTrack, RequirementStatus } from '../types'

interface RequirementsViewProps {
  selectedTrack: CareerTrack
  isInteractive: boolean
  onStatusChange: (itemId: string, status: RequirementStatus) => void
}

export function RequirementsView({
  selectedTrack,
  isInteractive,
  onStatusChange,
}: RequirementsViewProps) {
  return (
    <section className="screen-stack">
      <article className="context-note">
        Requirements are the conditions or actions needed for readiness. Documents
        are evidence used to prove or support them. Verify with official source
        and recruiter. Requirements may change.
      </article>
      <RequirementSummaryPanel selectedTrack={selectedTrack} />
      <RequirementInventoryView
        selectedTrack={selectedTrack}
        isInteractive={isInteractive}
        onStatusChange={onStatusChange}
      />
    </section>
  )
}

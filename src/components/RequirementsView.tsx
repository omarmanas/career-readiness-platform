import { RequirementInventoryView } from './RequirementInventoryView'
import { RequirementSummaryPanel } from './RequirementSummaryPanel'
import type { CareerTrack } from '../types'

interface RequirementsViewProps {
  selectedTrack: CareerTrack
}

export function RequirementsView({ selectedTrack }: RequirementsViewProps) {
  return (
    <section className="screen-stack">
      <article className="context-note">
        Requirements are the conditions or actions needed for readiness. Documents
        are evidence used to prove or support them. Verify with official source.
        Demo requirements are not final.
      </article>
      <RequirementSummaryPanel selectedTrack={selectedTrack} />
      <RequirementInventoryView selectedTrack={selectedTrack} />
    </section>
  )
}

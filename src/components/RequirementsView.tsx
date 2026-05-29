import { RequirementInventoryView } from './RequirementInventoryView'
import { RequirementSummaryPanel } from './RequirementSummaryPanel'
import { getText, type Language } from '../i18n'
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
      <article className="context-note">
        Requirements are the conditions or actions needed for readiness. Documents
        are evidence used to prove or support them.{' '}
        {getText(language, 'verifyOfficialSourceRecruiter')}.{' '}
        {getText(language, 'requirementsMayChange')}.
      </article>
      <RequirementSummaryPanel selectedTrack={selectedTrack} />
      <RequirementInventoryView
        selectedTrack={selectedTrack}
        isInteractive={isInteractive}
        language={language}
        onStatusChange={onStatusChange}
      />
    </section>
  )
}

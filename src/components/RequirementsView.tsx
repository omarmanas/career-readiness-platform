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
        {getText(language, 'requirementsContextNote')}{' '}
        {getText(language, 'verifyOfficialSourceRecruiter')}.{' '}
        {getText(language, 'requirementsMayChange')}.
      </article>
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

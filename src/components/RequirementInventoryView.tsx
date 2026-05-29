import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import {
  priorityTone,
  requirementStatusTone,
  requirementTypeTone,
} from '../utils/display'

const genericVerificationNotice =
  'Verify with official source. Demo requirements are not final.'

interface RequirementInventoryViewProps {
  selectedTrack: CareerTrack
}

export function RequirementInventoryView({
  selectedTrack,
}: RequirementInventoryViewProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h3>Readiness Requirements</h3>
        <span>Verify with official source and recruiter</span>
      </div>
      <div className="requirement-list">
        {selectedTrack.requirements.map((requirement) => {
          const whyItMatters =
            requirement.notes === genericVerificationNotice
              ? requirement.description
              : requirement.notes

          return (
            <article className="requirement-card" key={requirement.id}>
              <div className="requirement-card-header">
                <div>
                  <strong>{requirement.title}</strong>
                  <p>{requirement.description}</p>
                </div>
                <div className="badge-pair">
                  <Badge
                    label={requirement.requirementType}
                    tone={requirementTypeTone[requirement.requirementType]}
                  />
                  <Badge
                    label={requirement.status}
                    tone={requirementStatusTone[requirement.status]}
                  />
                  <Badge
                    label={requirement.priority}
                    tone={priorityTone[requirement.priority]}
                  />
                </div>
              </div>
              <div className="requirement-body">
                <div className="requirement-why">
                  <span>Why it matters</span>
                  <p>{whyItMatters}</p>
                </div>
                <div className="requirement-support">
                  <div>
                    <span>Readiness impact</span>
                    <strong>{requirement.readinessImpact} pts</strong>
                  </div>
                  <div>
                    <span>Related docs</span>
                    <strong>{requirement.relatedDocumentIds.length}</strong>
                  </div>
                  <div>
                    <span>Related trainings</span>
                    <strong>{requirement.relatedTrainingIds.length}</strong>
                  </div>
                </div>
              </div>
              {requirement.sourceName && (
                <div className="requirement-source-row">
                  <span>Source</span>
                  <small>
                    {requirement.sourceName} - {requirement.sourceType} - Last
                    reviewed {requirement.lastReviewed} -{' '}
                    {requirement.jurisdiction} - Confidence{' '}
                    {requirement.confidenceLevel}
                  </small>
                  {requirement.sourceUrl && (
                    <a href={requirement.sourceUrl} target="_blank" rel="noreferrer">
                      Verify with official source and recruiter
                    </a>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

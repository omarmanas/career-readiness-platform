import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import {
  documentImportanceTone,
  documentTone,
  privacyTone,
} from '../utils/display'

interface DocumentInventoryViewProps {
  selectedTrack: CareerTrack
}

export function DocumentInventoryView({
  selectedTrack,
}: DocumentInventoryViewProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h3>Document inventory</h3>
        <span>No uploads or real links</span>
      </div>
      <div className="document-inventory-list">
        {selectedTrack.documentChecklist.map((item) => (
          <article className="document-card" key={item.id}>
            <div className="document-card-main">
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <div className="badge-pair">
                <Badge label={item.status} tone={documentTone[item.status]} />
                <Badge
                  label={item.importance}
                  tone={documentImportanceTone[item.importance]}
                />
              </div>
            </div>
            <div className="document-detail-grid">
              <div>
                <span>Evidence</span>
                <strong>{item.evidenceType}</strong>
              </div>
              <div>
                <span>Privacy</span>
                <Badge label={item.privacyLevel} tone={privacyTone[item.privacyLevel]} />
              </div>
              <div>
                <span>Issuer</span>
                <strong>{item.issuer}</strong>
              </div>
              <div>
                <span>Readiness impact</span>
                <strong>{item.readinessImpact} pts</strong>
              </div>
              <div>
                <span>Issued</span>
                <strong>{item.issueDate}</strong>
              </div>
              <div>
                <span>Expires</span>
                <strong>{item.expirationDate}</strong>
              </div>
            </div>
            {item.sourceName && (
              <div className="source-attribution">
                <div>
                  <span>Source</span>
                  {item.sourceUrl ? (
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                      {item.sourceName}
                    </a>
                  ) : (
                    <strong>{item.sourceName}</strong>
                  )}
                </div>
                <div>
                  <span>Source type</span>
                  <strong>{item.sourceType ?? 'Unspecified'}</strong>
                </div>
                <div>
                  <span>Last reviewed</span>
                  <strong>{item.lastReviewed ?? 'Not reviewed'}</strong>
                </div>
                <div>
                  <span>Jurisdiction</span>
                  <strong>{item.jurisdiction ?? 'Not specified'}</strong>
                </div>
                <div>
                  <span>Confidence</span>
                  <strong>{item.confidenceLevel ?? 'Low'}</strong>
                </div>
                <p>Verify with official source and recruiter. Requirements may change.</p>
              </div>
            )}
            <p className="document-notes">{item.notes}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

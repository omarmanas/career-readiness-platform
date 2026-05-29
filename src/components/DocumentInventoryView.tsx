import { useState } from 'react'
import { Badge } from './Badge'
import { getStatusText, getText, type Language } from '../i18n'
import type { CareerTrack, DocumentStatus } from '../types'
import {
  documentImportanceTone,
  documentTone,
  privacyTone,
} from '../utils/display'

const DOCUMENT_STATUSES: DocumentStatus[] = [
  'Missing',
  'Pending',
  'Needs Review',
  'Available',
  'Verified',
  'Expired',
]

interface DocumentInventoryViewProps {
  selectedTrack: CareerTrack
  isInteractive: boolean
  language: Language
  onStatusChange: (itemId: string, status: DocumentStatus) => void
}

export function DocumentInventoryView({
  selectedTrack,
  isInteractive,
  language,
  onStatusChange,
}: DocumentInventoryViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h3>{getText(language, 'documents')}</h3>
        <span>No uploads or real links</span>
      </div>
      <div className="document-inventory-list">
        {selectedTrack.documentChecklist.map((item) => {
          const isExpanded = expandedIds.has(item.id)
          const hasSource = !!item.sourceName

          return (
            <article className="document-card" key={item.id}>
              <div className="card-primary-tier">
                <div className="card-left-col">
                  <strong className="card-item-title">{item.title}</strong>
                  <div className="card-badge-row">
                    <Badge
                      label={item.importance}
                      tone={documentImportanceTone[item.importance]}
                    />
                    <Badge
                      label={item.privacyLevel}
                      tone={privacyTone[item.privacyLevel]}
                    />
                    <Badge label={item.evidenceType} tone="neutral" />
                    <Badge label={`${item.readinessImpact} pts`} tone="success" />
                  </div>
                </div>

                <div className="card-right-col">
                  {isInteractive ? (
                    <select
                      className="status-control status-control--card"
                      data-status={item.status}
                      value={item.status}
                      onChange={(e) =>
                        onStatusChange(item.id, e.target.value as DocumentStatus)
                      }
                      aria-label={`Status for ${item.title}`}
                    >
                      {DOCUMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {getStatusText(language, s)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge
                      label={getStatusText(language, item.status)}
                      tone={documentTone[item.status]}
                    />
                  )}
                  <button
                    className="card-toggle"
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded
                      ? `^ ${getText(language, 'less')}`
                      : `> ${getText(language, 'details')}`}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="card-secondary-tier">
                  {hasSource && (
                    <Badge label={getText(language, 'verifySource')} tone="warning" />
                  )}
                  <p className="card-item-desc">{item.description}</p>

                  <div className="document-detail-grid">
                    <div>
                      <span>{getText(language, 'evidence')}</span>
                      <strong>{item.evidenceType}</strong>
                    </div>
                    <div>
                      <span>{getText(language, 'privacy')}</span>
                      <Badge
                        label={item.privacyLevel}
                        tone={privacyTone[item.privacyLevel]}
                      />
                    </div>
                    <div>
                      <span>{getText(language, 'issuer')}</span>
                      <strong>{item.issuer}</strong>
                    </div>
                    <div>
                      <span>{getText(language, 'readinessImpact')}</span>
                      <strong>{item.readinessImpact} pts</strong>
                    </div>
                    <div>
                      <span>{getText(language, 'issued')}</span>
                      <strong>{item.issueDate}</strong>
                    </div>
                    <div>
                      <span>{getText(language, 'expires')}</span>
                      <strong>{item.expirationDate}</strong>
                    </div>
                  </div>

                  {item.sourceName && (
                    <div className="source-attribution">
                      <div>
                        <span>{getText(language, 'source')}</span>
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
                      <p>
                        {getText(language, 'verifyOfficialSourceRecruiter')}.{' '}
                        {getText(language, 'requirementsMayChange')}.
                      </p>
                    </div>
                  )}

                  <p className="document-notes">
                    <strong>{getText(language, 'notes')}: </strong>
                    {item.notes}
                  </p>
                </div>
              )}
            </article>
          )
        })}
      </div>
      {!isInteractive && (
        <p className="status-control-note">
          Status controls are read-only for preview tracks.
        </p>
      )}
    </section>
  )
}

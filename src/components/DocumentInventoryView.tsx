import { useState } from 'react'
import { Badge } from './Badge'
import { getPriorityText, getStatusText, getText, type Language } from '../i18n'
import type { CareerTrack, DocumentItem, DocumentStatus, GuidanceSource } from '../types'
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

function getDocumentSource(item: DocumentItem): GuidanceSource | null {
  if (item.source) return item.source
  if (!item.sourceName) return null

  return {
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    sourceType: 'official',
    lastReviewed: item.lastReviewed,
    rationale: item.notes,
  }
}

function renderSourceSection(source: GuidanceSource | null, language: Language) {
  return (
    <section className="detail-section">
      <h5>{getText(language, 'source')}</h5>
      {source ? (
        <div className="source-attribution source-attribution--detail">
          <div>
            <span>{getText(language, 'sourceType')}</span>
            <strong>{source.sourceType}</strong>
          </div>
          <div>
            <span>{getText(language, 'sourceName')}</span>
            <strong>{source.sourceName}</strong>
          </div>
          <div>
            <span>{getText(language, 'sourceUrl')}</span>
            {source.sourceUrl ? (
              <a href={source.sourceUrl} target="_blank" rel="noreferrer">
                {getText(language, 'verifySource')}
              </a>
            ) : (
              <strong>{getText(language, 'notSpecified')}</strong>
            )}
          </div>
          <div>
            <span>{getText(language, 'lastReviewed')}</span>
            <strong>{source.lastReviewed ?? getText(language, 'notReviewed')}</strong>
          </div>
          <div>
            <span>{getText(language, 'rationale')}</span>
            <strong>{source.rationale ?? getText(language, 'notSpecified')}</strong>
          </div>
        </div>
      ) : (
        <p className="detail-muted-note">{getText(language, 'noSourceMetadata')}</p>
      )}
    </section>
  )
}

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
        <span>{getText(language, 'noUploadsRealLinks')}</span>
      </div>
      <div className="document-inventory-list">
        {selectedTrack.documentChecklist.map((item) => {
          const isExpanded = expandedIds.has(item.id)
          const source = getDocumentSource(item)

          return (
            <article className="document-card" key={item.id}>
              <div className="card-primary-tier">
                <div className="card-left-col">
                  <strong className="card-item-title">{item.title}</strong>
                  <div className="card-badge-row">
                    <Badge
                      label={getPriorityText(language, item.importance)}
                      tone={documentImportanceTone[item.importance]}
                    />
                    <Badge
                      label={item.privacyLevel}
                      tone={privacyTone[item.privacyLevel]}
                    />
                    <Badge label={item.evidenceType} tone="neutral" />
                    <Badge
                      label={`${item.readinessImpact} ${getText(language, 'pointAbbrev')}`}
                      tone="success"
                    />
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
                  <p className="card-item-desc">{item.description}</p>

                  <section className="detail-section">
                    <h5>{getText(language, 'whyThisMatters')}</h5>
                    <p>{item.notes}</p>
                  </section>

                  {renderSourceSection(source, language)}

                  <section className="detail-section">
                    <h5>{getText(language, 'verificationEvidence')}</h5>
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
                        <strong>
                          {item.readinessImpact} {getText(language, 'pointAbbrev')}
                        </strong>
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
                  </section>
                </div>
              )}
            </article>
          )
        })}
      </div>
      {!isInteractive && (
        <p className="status-control-note">
          {getText(language, 'readOnlyPreviewNote')}
        </p>
      )}
    </section>
  )
}

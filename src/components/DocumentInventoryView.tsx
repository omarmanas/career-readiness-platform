import { useState } from 'react'
import { Badge } from './Badge'
import { SourceSection } from './SourceSection'
import { getPriorityText, getStatusText, getText, type Language } from '../i18n'
import type { CareerTrack, DocumentItem, DocumentStatus, GuidanceSource } from '../types'
import { mapLegacySourceToGuidanceSource } from '../utils/sourceMapping'
import { isDocumentExpiringSoon } from '../utils/documents'
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

const URGENCY_TIER: Record<DocumentStatus, number> = {
  Missing: 0,
  Expired: 0,
  'Needs Review': 1,
  Pending: 1,
  Available: 2,
  Verified: 2,
}

function sortByUrgency(docs: DocumentItem[]): DocumentItem[] {
  return [...docs].sort((a, b) => {
    const tierDiff = URGENCY_TIER[a.status] - URGENCY_TIER[b.status]
    if (tierDiff !== 0) return tierDiff
    return b.readinessImpact - a.readinessImpact
  })
}

function getDocumentSource(item: DocumentItem): GuidanceSource | null {
  if (item.source) return item.source
  return mapLegacySourceToGuidanceSource(item)
}

function getDocumentActionKey(status: DocumentStatus) {
  if (status === 'Missing') return 'docActionCollect'
  if (status === 'Expired') return 'docActionRenew'
  if (status === 'Needs Review') return 'docActionReview'
  if (status === 'Pending') return 'docActionFollowUp'
  return 'docActionKeepReady'
}

function getDocumentReasonKey(status: DocumentStatus) {
  if (status === 'Missing' || status === 'Expired') return 'docReasonBlocksReadiness'
  if (status === 'Needs Review' || status === 'Pending') return 'docReasonNeedsConfirmation'
  return 'docReasonReadyForReview'
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
  const [isCompletedOpen, setIsCompletedOpen] = useState(false)

  const sorted = sortByUrgency(selectedTrack.documentChecklist)
  const needsAttentionDocs = sorted.filter((d) => URGENCY_TIER[d.status] < 2)
  const completedDocs = sorted.filter((d) => URGENCY_TIER[d.status] === 2)
  const firstDocumentAction = needsAttentionDocs[0]

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function renderDocumentCard(item: DocumentItem) {
    const isExpanded = expandedIds.has(item.id)
    const source = getDocumentSource(item)
    const actionText = getText(language, getDocumentActionKey(item.status))
    const reasonText = getText(language, getDocumentReasonKey(item.status))
    const isExpiringSoon = isDocumentExpiringSoon(item.expirationDate)

    return (
      <article className="document-card" key={item.id}>
        <div className="card-primary-tier">
          <div className="card-left-col">
            <strong className="card-item-title">{item.title}</strong>
            <div className="card-badge-row card-badge-row--compact">
              <Badge
                label={getPriorityText(language, item.importance)}
                tone={documentImportanceTone[item.importance]}
              />
              {isExpiringSoon && (
                <Badge label={getText(language, 'expiringSoonLabel')} tone="warning" />
              )}
            </div>
            <p className="document-next-action">
              <strong>{actionText}</strong>
              <span>{reasonText}</span>
            </p>
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

            <SourceSection source={source} language={language} />

            <section className="detail-section">
              <h5>{getText(language, 'verificationEvidence')}</h5>
              <div className="document-detail-grid">
                <div>
                  <span>{getText(language, 'evidence')}</span>
                  <strong>{item.evidenceType}</strong>
                </div>
                <div>
                  <span>{getText(language, 'impact')}</span>
                  <strong>
                    +{item.readinessImpact} {getText(language, 'pointAbbrev')}
                  </strong>
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
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h3>{getText(language, 'documents')}</h3>
      </div>

      <section className="document-coach-panel">
        <div>
          <span>{getText(language, 'documentCoachKicker')}</span>
          <h4>{getText(language, 'documentCoachTitle')}</h4>
          <p>
            {firstDocumentAction
              ? getText(language, 'documentCoachWithAction').replace(
                  '{document}',
                  firstDocumentAction.title,
                )
              : getText(language, 'documentCoachAllReady')}
          </p>
        </div>
        <div className="document-coach-metrics" aria-label={getText(language, 'documents')}>
          <span>
            <strong>{needsAttentionDocs.length}</strong>
            {getText(language, 'needAttentionShort')}
          </span>
          <span>
            <strong>{completedDocs.length}</strong>
            {getText(language, 'readyCanWaitShort')}
          </span>
        </div>
      </section>

      {needsAttentionDocs.length === 0 ? (
        <p className="detail-muted-note doc-inventory-ready">
          {getText(language, 'allDocumentsReadyCoach')}
        </p>
      ) : (
        <section className="requirement-mission-section">
          <div className="requirement-section-heading">
            <h4>{getText(language, 'needsAttention')}</h4>
            <span>{needsAttentionDocs.length}</span>
          </div>
          <div className="document-inventory-list">
            {needsAttentionDocs.map((item) => renderDocumentCard(item))}
          </div>
        </section>
      )}

      {completedDocs.length > 0 && (
        <section className="requirement-mission-section">
          <button
            className="requirement-section-heading requirement-section-heading--button"
            type="button"
            onClick={() => setIsCompletedOpen((prev) => !prev)}
            aria-expanded={isCompletedOpen}
          >
            <h4>{getText(language, 'completedDocuments')}</h4>
            <span>{completedDocs.length}</span>
          </button>
          {isCompletedOpen && (
            <div className="document-inventory-list completed-section-list">
              {completedDocs.map((item) => renderDocumentCard(item))}
            </div>
          )}
        </section>
      )}

      {!isInteractive && (
        <p className="status-control-note">
          {getText(language, 'readOnlyPreviewNote')}
        </p>
      )}
    </section>
  )
}

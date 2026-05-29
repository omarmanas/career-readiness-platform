import type { CareerTrack } from '../types'
import {
  getDocumentCoverage,
  getDocumentsNeedingReview,
  getExpiringDocuments,
  getMissingCriticalDocuments,
  getVerifiedDocuments,
} from '../utils/documents'

interface DocumentSummaryPanelProps {
  selectedTrack: CareerTrack
}

export function DocumentSummaryPanel({
  selectedTrack,
}: DocumentSummaryPanelProps) {
  const coverage = getDocumentCoverage(selectedTrack)
  const verified = getVerifiedDocuments(selectedTrack)
  const missingCritical = getMissingCriticalDocuments(selectedTrack)
  const needsReview = getDocumentsNeedingReview(selectedTrack)
  const expiringSoon = getExpiringDocuments(selectedTrack)

  return (
    <section className="document-summary-grid" aria-label="Document summary">
      <article className="metric-card">
        <span>Total documents</span>
        <strong>{coverage.total}</strong>
        <p>{coverage.percentage}% coverage</p>
      </article>
      <article className="metric-card">
        <span>Verified / Available</span>
        <strong>{verified.length}</strong>
        <p>Positive coverage documents</p>
      </article>
      <article className="metric-card">
        <span>Missing critical</span>
        <strong>{missingCritical.length}</strong>
        <p>Highest priority document risks</p>
      </article>
      <article className="metric-card">
        <span>Needs review</span>
        <strong>{needsReview.length}</strong>
        <p>Pending or review required</p>
      </article>
      <article className="metric-card">
        <span>Expiring soon</span>
        <strong>{expiringSoon.length}</strong>
        <p>Within demo 30-day window</p>
      </article>
    </section>
  )
}

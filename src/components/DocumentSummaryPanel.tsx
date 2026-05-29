import type { CareerTrack } from '../types'
import { getText, type Language } from '../i18n'
import {
  getDocumentCoverage,
  getDocumentsNeedingReview,
  getExpiringDocuments,
  getMissingCriticalDocuments,
  getVerifiedDocuments,
} from '../utils/documents'

interface DocumentSummaryPanelProps {
  selectedTrack: CareerTrack
  language: Language
}

export function DocumentSummaryPanel({
  selectedTrack,
  language,
}: DocumentSummaryPanelProps) {
  const coverage = getDocumentCoverage(selectedTrack)
  const verified = getVerifiedDocuments(selectedTrack)
  const missingCritical = getMissingCriticalDocuments(selectedTrack)
  const needsReview = getDocumentsNeedingReview(selectedTrack)
  const expiringSoon = getExpiringDocuments(selectedTrack)

  return (
    <section
      className="document-summary-grid"
      aria-label={getText(language, 'documents')}
    >
      <article className="metric-card">
        <span>{getText(language, 'totalDocuments')}</span>
        <strong>{coverage.total}</strong>
        <p>
          {coverage.percentage}% {getText(language, 'coverage')}
        </p>
      </article>
      <article className="metric-card">
        <span>{getText(language, 'verifiedAvailable')}</span>
        <strong>{verified.length}</strong>
        <p>{getText(language, 'positiveCoverageDocuments')}</p>
      </article>
      <article className="metric-card">
        <span>{getText(language, 'missingCritical')}</span>
        <strong>{missingCritical.length}</strong>
        <p>{getText(language, 'highestPriorityDocumentRisks')}</p>
      </article>
      <article className="metric-card">
        <span>{getText(language, 'needsReview')}</span>
        <strong>{needsReview.length}</strong>
        <p>{getText(language, 'pendingOrReviewRequired')}</p>
      </article>
      <article className="metric-card">
        <span>{getText(language, 'expiringSoon')}</span>
        <strong>{expiringSoon.length}</strong>
        <p>{getText(language, 'withinDemoThirtyDayWindow')}</p>
      </article>
    </section>
  )
}

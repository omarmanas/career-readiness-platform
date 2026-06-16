import type {
  CareerTrack,
  DocumentImportance,
  DocumentItem,
  DocumentStatus,
} from '../types'

const coveredStatuses: DocumentStatus[] = ['Available', 'Verified']
const reviewStatuses: DocumentStatus[] = ['Needs Review', 'Pending']
const importantRanks: Record<DocumentImportance, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

function isCovered(document: DocumentItem) {
  return coveredStatuses.includes(document.status)
}

// @deprecated label — all expirationDate values in seed data are human-readable
// labels, not ISO dates. When real ISO dates are introduced, remove this list
// and rely solely on the date-comparison branch below.
const LEGACY_EXPIRING_LABELS = ['Next 30 days']

export function isDocumentExpiringSoon(
  expirationDate: string,
  withinDays = 30,
): boolean {
  // Try ISO date first (YYYY-MM-DD or full ISO string)
  const parsed = Date.parse(expirationDate)
  if (!isNaN(parsed)) {
    const cutoff = Date.now() + withinDays * 24 * 60 * 60 * 1000
    return parsed <= cutoff
  }
  // Legacy label fallback
  return LEGACY_EXPIRING_LABELS.includes(expirationDate)
}

function isExpiringSoon(document: DocumentItem) {
  return isDocumentExpiringSoon(document.expirationDate)
}

export function getDocumentCoverage(track: CareerTrack) {
  const total = track.documentChecklist.length
  const covered = track.documentChecklist.filter(isCovered).length

  return {
    total,
    covered,
    percentage: total === 0 ? 100 : Math.round((covered / total) * 100),
  }
}

export function getMissingCriticalDocuments(track: CareerTrack) {
  return track.documentChecklist.filter(
    (document) =>
      document.importance === 'Critical' &&
      (document.status === 'Missing' || document.status === 'Expired'),
  )
}

export function getExpiringDocuments(track: CareerTrack) {
  return track.documentChecklist.filter(isExpiringSoon)
}

export function getDocumentsNeedingReview(track: CareerTrack) {
  return track.documentChecklist.filter((document) =>
    reviewStatuses.includes(document.status),
  )
}

export function getVerifiedDocuments(track: CareerTrack) {
  return track.documentChecklist.filter((document) => isCovered(document))
}

export function calculateDocumentReadinessImpact(track: CareerTrack) {
  return track.documentChecklist.reduce((total, document) => {
    if (isCovered(document)) {
      return total
    }

    return total + document.readinessImpact
  }, 0)
}

export function getDocumentRiskSummary(track: CareerTrack) {
  const missingCritical = getMissingCriticalDocuments(track)
  const needsReview = getDocumentsNeedingReview(track)
  const expiringSoon = getExpiringDocuments(track)
  const highestImpactMissingDocument = [...track.documentChecklist]
    .filter((document) => !isCovered(document))
    .sort((a, b) => {
      const impactDelta = b.readinessImpact - a.readinessImpact

      if (impactDelta !== 0) {
        return impactDelta
      }

      return importantRanks[b.importance] - importantRanks[a.importance]
    })[0]

  return {
    coverage: getDocumentCoverage(track),
    missingCritical,
    needsReview,
    expiringSoon,
    readinessImpact: calculateDocumentReadinessImpact(track),
    highestImpactMissingDocument,
  }
}

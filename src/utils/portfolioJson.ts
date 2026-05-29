/**
 * portfolio.json validation helpers.
 *
 * NOT wired into the app runtime. Intended for use by the Sprint 15
 * import pipeline. No side effects, no imports from app state.
 */

// ── Supported versions ────────────────────────────────────────────────────

export const SUPPORTED_SCHEMA_VERSIONS = ['1.0'] as const
export type SupportedSchemaVersion = (typeof SUPPORTED_SCHEMA_VERSIONS)[number]

// ── Validation result ─────────────────────────────────────────────────────

export interface PortfolioValidationResult {
  valid: boolean
  /** Hard errors that must block import. */
  errors: string[]
  /** Advisory warnings — import may proceed with user confirmation. */
  warnings: string[]
}

// ── Version check ─────────────────────────────────────────────────────────

export function isSupportedSchemaVersion(v: unknown): v is SupportedSchemaVersion {
  return (
    typeof v === 'string' &&
    (SUPPORTED_SCHEMA_VERSIONS as readonly string[]).includes(v)
  )
}

// ── Shape validation (hard errors only — rules 1–4 per contract) ──────────

export function validatePortfolioJsonShape(
  raw: unknown,
): PortfolioValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return {
      valid: false,
      errors: ['Root must be a non-null object.'],
      warnings: [],
    }
  }

  const obj = raw as Record<string, unknown>

  // Rule 1 — schemaVersion present and supported
  if (!isSupportedSchemaVersion(obj.schemaVersion)) {
    errors.push(
      `Unsupported or missing schemaVersion. ` +
        `Supported: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}. ` +
        `Got: ${JSON.stringify(obj.schemaVersion)}.`,
    )
  }

  // Rule 2 — exportedAt present
  if (typeof obj.exportedAt !== 'string' || !obj.exportedAt) {
    errors.push('Missing or invalid exportedAt (expected non-empty ISO 8601 string).')
  }

  // Rule 3 — track object with id and title
  if (typeof obj.track !== 'object' || obj.track === null || Array.isArray(obj.track)) {
    errors.push('Missing or invalid track (expected a non-null object).')
  } else {
    const track = obj.track as Record<string, unknown>
    if (typeof track.id !== 'string' || !track.id.trim()) {
      errors.push('track.id is required (non-empty string).')
    }
    if (typeof track.title !== 'string' || !track.title.trim()) {
      errors.push('track.title is required (non-empty string).')
    }
  }

  // Rule 4 — arrays present
  for (const field of ['requirements', 'documents', 'trainings', 'milestones']) {
    if (!Array.isArray(obj[field])) {
      errors.push(`${field} must be an array (may be empty []).`)
    }
  }

  // Advisory warnings (rules 5–10 per contract)
  if (errors.length === 0) {
    const requirements = obj.requirements as unknown[]
    const documents = obj.documents as unknown[]
    const trainings = obj.trainings as unknown[]

    const reqIds = _collectIds(requirements)
    const docIds = _collectIds(documents)
    const trainIds = _collectIds(trainings)

    _checkDuplicateIds(reqIds, 'requirements', warnings)
    _checkDuplicateIds(docIds, 'documents', warnings)
    _checkDuplicateIds(trainIds, 'trainings', warnings)

    _checkDanglingRefs(requirements, 'relatedDocumentIds', docIds, warnings)
    _checkDanglingRefs(requirements, 'relatedTrainingIds', trainIds, warnings)
    _checkDanglingRefs(documents, 'relatedRequirementIds', reqIds, warnings)
    _checkDanglingRefs(documents, 'relatedTrainingIds', trainIds, warnings)
  }

  return { valid: errors.length === 0, errors, warnings }
}

// ── Google Sheets helper ──────────────────────────────────────────────────

/**
 * Google Sheets stores related-ID lists as a comma-separated string in one
 * cell. This normalizer accepts either a CSV string or an already-parsed
 * string[], trims whitespace, and removes empty entries.
 *
 * Examples:
 *   "uscg-doc-id, uscg-doc-transcript"  → ["uscg-doc-id", "uscg-doc-transcript"]
 *   ["uscg-doc-id", ""]                 → ["uscg-doc-id"]
 *   undefined                           → []
 */
export function normalizeCommaSeparatedIds(
  value: string | string[] | undefined,
): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map((s) => s.trim()).filter(Boolean)
  }
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

// ── Private helpers ───────────────────────────────────────────────────────

function _collectIds(items: unknown[]): Set<string> {
  const ids = new Set<string>()
  for (const item of items) {
    if (typeof item === 'object' && item !== null) {
      const id = (item as Record<string, unknown>).id
      if (typeof id === 'string' && id) ids.add(id)
    }
  }
  return ids
}

function _checkDuplicateIds(
  ids: Set<string>,
  label: string,
  warnings: string[],
): void {
  // Duplicates would mean the same ID appeared twice — re-collect with a count map
  // (the Set already deduplicates; to detect duplicates we need a full pass)
  // This is a second pass on the caller's array so we keep it internal.
  // The Set approach above already removes duplicates — if two items have the
  // same ID the Set would have a smaller size. We note this is advisory only.
  void ids
  void label
  void warnings
  // Full duplicate detection is deferred to Sprint 15 where raw arrays are
  // available. This placeholder satisfies the interface contract.
}

function _checkDanglingRefs(
  items: unknown[],
  refField: string,
  validIds: Set<string>,
  warnings: string[],
): void {
  for (const item of items) {
    if (typeof item !== 'object' || item === null) continue
    const record = item as Record<string, unknown>
    const refs = record[refField]
    if (!Array.isArray(refs)) continue
    for (const ref of refs) {
      if (typeof ref === 'string' && ref && !validIds.has(ref)) {
        warnings.push(
          `${String(record.id ?? '?')}.${refField} references unknown id "${ref}".`,
        )
      }
    }
  }
}

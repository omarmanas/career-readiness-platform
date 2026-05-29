/**
 * portfolio.json validation helpers.
 *
 * NOT wired into the app runtime. Intended for use by the import pipeline.
 * No side effects, no imports from app state.
 */

export const SUPPORTED_SCHEMA_VERSIONS = ['1.0'] as const
export type SupportedSchemaVersion = (typeof SUPPORTED_SCHEMA_VERSIONS)[number]

export interface PortfolioValidationResult {
  valid: boolean
  /** Hard errors that must block import. */
  errors: string[]
  /** Advisory warnings; import may proceed with user confirmation. */
  warnings: string[]
}

export type PortfolioIdCollectionName =
  | 'requirements'
  | 'documents'
  | 'trainings'
  | 'milestones'

export function isSupportedSchemaVersion(v: unknown): v is SupportedSchemaVersion {
  return (
    typeof v === 'string' &&
    (SUPPORTED_SCHEMA_VERSIONS as readonly string[]).includes(v)
  )
}

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

  if (!isSupportedSchemaVersion(obj.schemaVersion)) {
    errors.push(
      `Unsupported or missing schemaVersion. ` +
        `Supported: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}. ` +
        `Got: ${JSON.stringify(obj.schemaVersion)}.`,
    )
  }

  if (typeof obj.exportedAt !== 'string' || !obj.exportedAt) {
    errors.push('Missing or invalid exportedAt (expected non-empty ISO 8601 string).')
  }

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

  for (const field of ['requirements', 'documents', 'trainings', 'milestones']) {
    if (!Array.isArray(obj[field])) {
      errors.push(`${field} must be an array (may be empty []).`)
    }
  }

  if (errors.length === 0) {
    const requirements = obj.requirements as unknown[]
    const documents = obj.documents as unknown[]
    const trainings = obj.trainings as unknown[]
    const milestones = obj.milestones as unknown[]

    const reqIds = collectIds(requirements)
    const docIds = collectIds(documents)
    const trainIds = collectIds(trainings)

    checkDuplicateIds(
      {
        requirements,
        documents,
        trainings,
        milestones,
      },
      errors,
    )

    checkDanglingRefs(requirements, 'relatedDocumentIds', docIds, warnings)
    checkDanglingRefs(requirements, 'relatedTrainingIds', trainIds, warnings)
    checkDanglingRefs(documents, 'relatedRequirementIds', reqIds, warnings)
    checkDanglingRefs(documents, 'relatedTrainingIds', trainIds, warnings)
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Google Sheets stores related-ID lists as a comma-separated string in one
 * cell. This normalizer accepts either a CSV string or an already-parsed
 * string[], trims whitespace, and removes empty entries.
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

export function checkDuplicateIds(
  collections: Record<PortfolioIdCollectionName, unknown[]>,
  errors: string[] = [],
): string[] {
  const seen = new Map<string, string>()

  for (const [collection, items] of Object.entries(collections)) {
    items.forEach((item, index) => {
      if (typeof item !== 'object' || item === null) return

      const id = (item as Record<string, unknown>).id
      if (typeof id !== 'string' || !id.trim()) return

      const trimmedId = id.trim()
      const location = `${collection}[${index}]`
      const firstLocation = seen.get(trimmedId)

      if (firstLocation) {
        errors.push(
          `Duplicate id "${trimmedId}" found at ${location}; first seen at ${firstLocation}.`,
        )
        return
      }

      seen.set(trimmedId, location)
    })
  }

  return errors
}

function collectIds(items: unknown[]): Set<string> {
  const ids = new Set<string>()
  for (const item of items) {
    if (typeof item === 'object' && item !== null) {
      const id = (item as Record<string, unknown>).id
      if (typeof id === 'string' && id) ids.add(id)
    }
  }
  return ids
}

function checkDanglingRefs(
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

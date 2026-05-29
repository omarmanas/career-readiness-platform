import type { PortfolioJson } from '../types/portfolioJson'
import {
  checkDuplicateIds,
  normalizeCommaSeparatedIds,
  validatePortfolioJsonShape,
} from './portfolioJson'

export interface PortfolioImportReport {
  valid: boolean
  schemaVersion?: string
  errors: string[]
  warnings: string[]
  stats: {
    requirements: number
    documents: number
    trainings: number
    milestones: number
  }
}

export interface PortfolioImportResult {
  portfolio: PortfolioJson | null
  report: PortfolioImportReport
}

type RelatedIdField =
  | 'relatedDocumentIds'
  | 'relatedTrainingIds'
  | 'relatedRequirementIds'

const EMPTY_STATS: PortfolioImportReport['stats'] = {
  requirements: 0,
  documents: 0,
  trainings: 0,
  milestones: 0,
}

export function loadPortfolioJson(raw: unknown): PortfolioImportResult {
  const parsed = parseRawPortfolioJson(raw)
  if (!parsed.ok) {
    return createResult(null, undefined, [parsed.error], [], EMPTY_STATS)
  }

  const shape = validatePortfolioJsonShape(parsed.value)
  const schemaVersion = readSchemaVersion(parsed.value)
  const structureErrors: string[] = []

  if (shape.valid) {
    validatePortfolioItemObjects(parsed.value, structureErrors)
  }

  if (!shape.valid || structureErrors.length > 0) {
    return createResult(
      null,
      schemaVersion,
      [...shape.errors, ...structureErrors],
      shape.warnings,
      buildStats(parsed.value),
    )
  }

  const warnings = [...shape.warnings]
  const portfolio = normalizePortfolio(parsed.value, warnings)
  const errors = [...shape.errors]

  validateReadinessImpact(portfolio.requirements, 'requirements', errors)
  validateReadinessImpact(portfolio.documents, 'documents', errors)
  checkDuplicateIds(
    {
      requirements: portfolio.requirements,
      documents: portfolio.documents,
      trainings: portfolio.trainings,
      milestones: portfolio.milestones,
    },
    errors,
  )
  validateRelatedIds(portfolio, warnings)

  return createResult(
    portfolio,
    schemaVersion,
    errors,
    warnings,
    buildStats(portfolio),
  )
}

function parseRawPortfolioJson(
  raw: unknown,
): { ok: true; value: unknown } | { ok: false; error: string } {
  if (typeof raw !== 'string') {
    return { ok: true, value: raw }
  }

  try {
    return { ok: true, value: JSON.parse(raw) as unknown }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, error: `Invalid JSON: ${message}` }
  }
}

function normalizePortfolio(raw: unknown, warnings: string[]): PortfolioJson {
  const portfolio = raw as PortfolioJson

  return {
    ...portfolio,
    requirements: portfolio.requirements.map((requirement) => ({
      ...requirement,
      relatedDocumentIds: normalizeRelatedIds(
        requirement.relatedDocumentIds,
        `requirements.${requirement.id}.relatedDocumentIds`,
        warnings,
      ),
      relatedTrainingIds: normalizeRelatedIds(
        requirement.relatedTrainingIds,
        `requirements.${requirement.id}.relatedTrainingIds`,
        warnings,
      ),
    })),
    documents: portfolio.documents.map((document) => ({
      ...document,
      relatedRequirementIds: normalizeRelatedIds(
        document.relatedRequirementIds,
        `documents.${document.id}.relatedRequirementIds`,
        warnings,
      ),
      relatedTrainingIds: normalizeRelatedIds(
        document.relatedTrainingIds,
        `documents.${document.id}.relatedTrainingIds`,
        warnings,
      ),
    })),
    trainings: [...portfolio.trainings],
    milestones: [...portfolio.milestones],
  }
}

function normalizeRelatedIds(
  value: unknown,
  field: string,
  warnings: string[],
): string[] {
  if (typeof value === 'string' || typeof value === 'undefined') {
    return normalizeCommaSeparatedIds(value)
  }

  if (Array.isArray(value)) {
    const normalized = value
      .filter((id): id is string => typeof id === 'string')
      .map((id) => id.trim())
      .filter(Boolean)

    if (normalized.length !== value.length) {
      warnings.push(`${field} contained non-string values that were ignored.`)
    }

    return normalized
  }

  warnings.push(`${field} must be a comma-separated string or string array.`)
  return []
}

function validateReadinessImpact(
  items: Array<{ id: string; readinessImpact: number }>,
  collection: string,
  errors: string[],
): void {
  items.forEach((item, index) => {
    if (
      !Number.isInteger(item.readinessImpact) ||
      item.readinessImpact < 1 ||
      item.readinessImpact > 100
    ) {
      errors.push(
        `${collection}[${index}] "${item.id}" readinessImpact must be an integer between 1 and 100.`,
      )
    }
  })
}

function validateRelatedIds(
  portfolio: PortfolioJson,
  warnings: string[],
): void {
  const requirementIds = new Set(portfolio.requirements.map((item) => item.id))
  const documentIds = new Set(portfolio.documents.map((item) => item.id))
  const trainingIds = new Set(portfolio.trainings.map((item) => item.id))

  for (const requirement of portfolio.requirements) {
    validateRelatedIdField(
      requirement.id,
      'relatedDocumentIds',
      requirement.relatedDocumentIds,
      documentIds,
      warnings,
    )
    validateRelatedIdField(
      requirement.id,
      'relatedTrainingIds',
      requirement.relatedTrainingIds,
      trainingIds,
      warnings,
    )
  }

  for (const document of portfolio.documents) {
    validateRelatedIdField(
      document.id,
      'relatedRequirementIds',
      document.relatedRequirementIds,
      requirementIds,
      warnings,
    )
    validateRelatedIdField(
      document.id,
      'relatedTrainingIds',
      document.relatedTrainingIds,
      trainingIds,
      warnings,
    )
  }
}

function validateRelatedIdField(
  ownerId: string,
  field: RelatedIdField,
  refs: string[],
  validIds: Set<string>,
  warnings: string[],
): void {
  for (const ref of refs) {
    if (!validIds.has(ref)) {
      warnings.push(`${ownerId}.${field} references unknown id "${ref}".`)
    }
  }
}

function createResult(
  portfolio: PortfolioJson | null,
  schemaVersion: string | undefined,
  errors: string[],
  warnings: string[],
  stats: PortfolioImportReport['stats'],
): PortfolioImportResult {
  const uniqueErrors = [...new Set(errors)]
  const uniqueWarnings = [...new Set(warnings)]

  return {
    portfolio,
    report: {
      valid: uniqueErrors.length === 0,
      schemaVersion,
      errors: uniqueErrors,
      warnings: uniqueWarnings,
      stats,
    },
  }
}

function readSchemaVersion(raw: unknown): string | undefined {
  if (
    typeof raw === 'object' &&
    raw !== null &&
    !Array.isArray(raw) &&
    typeof (raw as Record<string, unknown>).schemaVersion === 'string'
  ) {
    return (raw as Record<string, string>).schemaVersion
  }

  return undefined
}

function validatePortfolioItemObjects(raw: unknown, errors: string[]): void {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return

  const record = raw as Record<string, unknown>
  for (const collection of ['requirements', 'documents', 'trainings', 'milestones']) {
    const items = record[collection]
    if (!Array.isArray(items)) continue

    items.forEach((item, index) => {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        errors.push(`${collection}[${index}] must be a non-null object.`)
      }
    })
  }
}

function buildStats(raw: unknown): PortfolioImportReport['stats'] {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return EMPTY_STATS
  }

  const record = raw as Record<string, unknown>

  return {
    requirements: Array.isArray(record.requirements) ? record.requirements.length : 0,
    documents: Array.isArray(record.documents) ? record.documents.length : 0,
    trainings: Array.isArray(record.trainings) ? record.trainings.length : 0,
    milestones: Array.isArray(record.milestones) ? record.milestones.length : 0,
  }
}

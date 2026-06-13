import type { GuidanceSource, SourceAttribution } from '../types'

type LegacySourceInput = SourceAttribution & {
  notes?: string
}

function mapLegacySourceType(
  sourceType: SourceAttribution['sourceType'],
): GuidanceSource['sourceType'] {
  switch (sourceType) {
    case 'Official':
      return 'official_regulatory'
    case 'Training Provider':
      return 'best_practice'
    case 'Internal':
      return 'informed'
    case 'User Provided':
      return 'informed'
    default:
      // Unknown legacy source types should not be promoted to official.
      return 'estimated'
  }
}

function mapKnownLegacyConfidence(
  confidenceLevel: SourceAttribution['confidenceLevel'],
): GuidanceSource['confidenceLevel'] {
  switch (confidenceLevel) {
    case 'High':
      return 'high'
    case 'Medium':
      return 'medium'
    case 'Low':
      return 'low'
    default:
      return 'estimated'
  }
}

function mapLegacyConfidence(
  sourceType: SourceAttribution['sourceType'],
  confidenceLevel: SourceAttribution['confidenceLevel'],
): GuidanceSource['confidenceLevel'] {
  if (sourceType === 'Official') return 'official'

  if (sourceType === 'Internal') {
    return confidenceLevel === 'Low' ? 'low' : 'medium'
  }

  if (sourceType === 'User Provided') {
    return confidenceLevel === 'Low' ? 'low' : 'medium'
  }

  if (!sourceType) {
    return confidenceLevel ? 'low' : 'estimated'
  }

  return mapKnownLegacyConfidence(confidenceLevel)
}

export function mapLegacySourceToGuidanceSource(
  source: LegacySourceInput,
): GuidanceSource | null {
  if (!source.sourceName && !source.sourceUrl) return null

  return {
    sourceName: source.sourceName ?? 'Unspecified source',
    sourceUrl: source.sourceUrl,
    sourceType: mapLegacySourceType(source.sourceType),
    lastReviewed: source.lastReviewed,
    rationale: source.notes,
    confidenceLevel: mapLegacyConfidence(
      source.sourceType,
      source.confidenceLevel,
    ),
  }
}

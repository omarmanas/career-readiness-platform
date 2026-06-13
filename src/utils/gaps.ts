import type {
  ActionEffort,
  ActionImpact,
  CareerTrack,
  GapSeverity,
  GapStatus,
  ReadinessGap,
} from '../types'
import { effortRank, impactRank, severityRank } from './constants'

const statusRank: Record<GapStatus, number> = {
  Open: 4,
  'In Progress': 3,
  Deferred: 2,
  Resolved: 1,
}

export function calculateActionPriority(
  impact: ActionImpact,
  effort: ActionEffort,
  severity: GapSeverity,
) {
  return impactRank[impact] * 3 + effortRank[effort] * 2 + severityRank[severity]
}

export function getReadinessGaps(track: CareerTrack) {
  return track.readinessGaps
}

export function getTopGaps(track: CareerTrack, limit = 3) {
  return [...getReadinessGaps(track)]
    .sort((a, b) => {
      const statusDelta = statusRank[b.status] - statusRank[a.status]

      if (statusDelta !== 0) {
        return statusDelta
      }

      return severityRank[b.severity] - severityRank[a.severity]
    })
    .slice(0, limit)
}

export function getHighestRoiAction(track: CareerTrack) {
  const unresolvedGaps = getReadinessGaps(track).filter(
    (gap) => gap.status !== 'Resolved' && gap.status !== 'Deferred',
  )

  return unresolvedGaps
    .map((gap) => ({
      gap,
      priority: calculateActionPriority(
        gap.recommendedAction.impact,
        gap.recommendedAction.effort,
        gap.severity,
      ),
    }))
    .sort((a, b) => b.priority - a.priority)[0]
}

export function getTopUnresolvedGap(track: CareerTrack): ReadinessGap | undefined {
  return getTopGaps(track, track.readinessGaps.length).find(
    (gap) => gap.status !== 'Resolved' && gap.status !== 'Deferred',
  )
}

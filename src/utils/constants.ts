import type { ActionEffort, ActionImpact, GapSeverity } from '../types'

export const severityRank: Record<GapSeverity, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

export const impactRank: Record<ActionImpact, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
}

export const effortRank: Record<ActionEffort, number> = {
  Low: 3,
  Medium: 2,
  High: 1,
}

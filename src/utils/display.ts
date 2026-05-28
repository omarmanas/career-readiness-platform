import type {
  DocumentStatus,
  GapSeverity,
  GapStatus,
  Priority,
  ReadinessCategoryStatus,
  RiskLevel,
  TrainingStatus,
  TrackStatus,
} from '../types'
import type { BadgeTone } from '../components/Badge'

export const trainingTone: Record<TrainingStatus, BadgeTone> = {
  Completed: 'success',
  Planned: 'info',
  'In Progress': 'warning',
  Pending: 'neutral',
  Deferred: 'danger',
}

export const priorityTone: Record<Priority, BadgeTone> = {
  Low: 'neutral',
  Medium: 'info',
  High: 'warning',
  Critical: 'danger',
}

export const riskTone: Record<RiskLevel, BadgeTone> = {
  Low: 'neutral',
  Medium: 'info',
  High: 'warning',
  Critical: 'danger',
}

export const documentTone: Record<DocumentStatus, BadgeTone> = {
  Available: 'success',
  Missing: 'danger',
  Pending: 'warning',
}

export const trackTone: Record<TrackStatus, BadgeTone> = {
  Exploring: 'info',
  Preparing: 'warning',
  'Application Ready': 'success',
}

export const readinessCategoryTone: Record<
  ReadinessCategoryStatus,
  BadgeTone
> = {
  Ready: 'success',
  Improving: 'warning',
  'At Risk': 'danger',
}

export const gapSeverityTone: Record<GapSeverity, BadgeTone> = {
  Low: 'neutral',
  Medium: 'info',
  High: 'warning',
  Critical: 'danger',
}

export const gapStatusTone: Record<GapStatus, BadgeTone> = {
  Open: 'danger',
  'In Progress': 'warning',
  Resolved: 'success',
  Deferred: 'neutral',
}

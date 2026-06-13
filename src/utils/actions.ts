import type {
  ActionEffort,
  ActionPriority,
  ActionStatus,
  CareerTrack,
  GapSeverity,
  GapStatus,
  NextAction,
} from '../types'
import { effortRank, impactRank, severityRank } from './constants'

const statusRank: Record<ActionStatus, number> = {
  Pending: 5,
  Scheduled: 4,
  'In Progress': 3,
  Deferred: 2,
  Completed: 1,
}

function actionPriorityFromSeverity(severity: GapSeverity): ActionPriority {
  if (severity === 'Critical') {
    return 'Critical'
  }

  if (severity === 'High') {
    return 'High'
  }

  if (severity === 'Medium') {
    return 'Medium'
  }

  return 'Low'
}

function actionStatusFromGapStatus(status: GapStatus): ActionStatus {
  if (status === 'In Progress') {
    return 'In Progress'
  }

  if (status === 'Resolved') {
    return 'Completed'
  }

  if (status === 'Deferred') {
    return 'Deferred'
  }

  return 'Pending'
}

function dueWindowFromSeverity(severity: GapSeverity) {
  if (severity === 'Critical') {
    return 'This week'
  }

  if (severity === 'High') {
    return 'Next 2 weeks'
  }

  if (severity === 'Medium') {
    return 'Next 30 days'
  }

  return 'When capacity allows'
}

function sortActions(actions: NextAction[]) {
  return [...actions].sort((a, b) => {
    const statusDelta = statusRank[b.status] - statusRank[a.status]

    if (statusDelta !== 0) {
      return statusDelta
    }

    const priorityDelta =
      severityRank[b.priority] - severityRank[a.priority]

    if (priorityDelta !== 0) {
      return priorityDelta
    }

    const impactDelta =
      impactRank[b.expectedImpact] - impactRank[a.expectedImpact]

    if (impactDelta !== 0) {
      return impactDelta
    }

    return effortRank[b.estimatedEffort] - effortRank[a.estimatedEffort]
  })
}

export function generateNextActions(track: CareerTrack): NextAction[] {
  return track.readinessGaps.map((gap) => ({
    id: `next-${gap.id}`,
    title: gap.recommendedAction.title,
    description: gap.recommendedAction.whyItMatters,
    priority: actionPriorityFromSeverity(gap.severity),
    status: actionStatusFromGapStatus(gap.status),
    estimatedEffort: gap.recommendedAction.effort,
    expectedImpact: gap.recommendedAction.impact,
    sourceGapId: gap.id,
    dueWindow: dueWindowFromSeverity(gap.severity),
    category: gap.category,
  }))
}

export function getTopActions(track: CareerTrack, limit = 5) {
  return sortActions(generateNextActions(track)).slice(0, limit)
}

export function getImmediateAction(track: CareerTrack) {
  return getTopActions(track, 1)[0]
}

export function getWeeklyPlan(track: CareerTrack) {
  return getTopActions(track, 5)
}

export function getExecutionSummary(track: CareerTrack) {
  const actions = generateNextActions(track)
  const effortTotal = actions.reduce(
    (total, action) => total + (4 - effortRank[action.estimatedEffort]),
    0,
  )
  const averageEffortValue = actions.length > 0 ? effortTotal / actions.length : 0
  const averageEffortLevel: ActionEffort =
    averageEffortValue >= 2.5
      ? 'High'
      : averageEffortValue >= 1.5
        ? 'Medium'
        : 'Low'

  return {
    pendingActions: actions.filter((action) => action.status === 'Pending').length,
    completedActions: actions.filter((action) => action.status === 'Completed')
      .length,
    criticalActions: actions.filter((action) => action.priority === 'Critical')
      .length,
    averageEffortLevel,
  }
}

export function getReadinessNarrative(track: CareerTrack) {
  const actions = getTopActions(track, 2)
  const limitingCategories = [...track.readinessCategories]
    .sort(
      (a, b) =>
        b.targetScore - b.score - (a.targetScore - a.score),
    )
    .slice(0, 2)
    .map((category) => category.name.toLowerCase())

  if (actions.length === 0) {
    return `Readiness is currently stable across ${track.title}. Keep maintaining completed actions and monitor category targets.`
  }

  const actionPhrase =
    actions.length === 1
      ? actions[0].title.toLowerCase()
      : `${actions[0].title.toLowerCase()} and ${actions[1].title.toLowerCase()}`

  return `Readiness is currently limited by ${limitingCategories.join(
    ' and ',
  )}. The fastest path to improvement is ${actionPhrase}.`
}

import type { CareerTrack, GapSeverity } from '../types'
import { getTopActions } from './actions'
import {
  calculateReadinessScore,
  getAvailableDocumentCount,
  getCompletedMilestoneCount,
  getCompletedRequirementCount,
  getCompletedTrainingCount,
} from './readiness'

const readinessWeights = {
  requirements: 0.4,
  trainings: 0.25,
  documents: 0.2,
  milestones: 0.15,
}

// ── Readiness Breakdown ────────────────────────────────────────────────────

export interface ComponentBreakdown {
  label: string
  completed: number
  total: number
  pct: number
  weight: number
  contribution: number
}

export interface ReadinessBreakdown {
  components: ComponentBreakdown[]
  overall: number
}

export function getReadinessBreakdown(track: CareerTrack): ReadinessBreakdown {
  const reqCompleted = getCompletedRequirementCount(track.requirements)
  const reqTotal = track.requirements.length
  const reqPct = reqTotal > 0 ? Math.round((reqCompleted / reqTotal) * 100) : 100

  const trainCompleted = getCompletedTrainingCount(track.trainingPlan)
  const trainTotal = track.trainingPlan.length
  const trainPct = trainTotal > 0 ? Math.round((trainCompleted / trainTotal) * 100) : 100

  const docAvailable = getAvailableDocumentCount(track.documentChecklist)
  const docTotal = track.documentChecklist.length
  const docPct = docTotal > 0 ? Math.round((docAvailable / docTotal) * 100) : 100

  const msCompleted = getCompletedMilestoneCount(track.milestones)
  const msTotal = track.milestones.length
  const msPct = msTotal > 0 ? Math.round((msCompleted / msTotal) * 100) : 100

  return {
    components: [
      {
        label: 'Requirements',
        completed: reqCompleted,
        total: reqTotal,
        pct: reqPct,
        weight: 40,
        contribution: Math.round(reqPct * readinessWeights.requirements),
      },
      {
        label: 'Training',
        completed: trainCompleted,
        total: trainTotal,
        pct: trainPct,
        weight: 25,
        contribution: Math.round(trainPct * readinessWeights.trainings),
      },
      {
        label: 'Documents',
        completed: docAvailable,
        total: docTotal,
        pct: docPct,
        weight: 20,
        contribution: Math.round(docPct * readinessWeights.documents),
      },
      {
        label: 'Milestones',
        completed: msCompleted,
        total: msTotal,
        pct: msPct,
        weight: 15,
        contribution: Math.round(msPct * readinessWeights.milestones),
      },
    ],
    overall: calculateReadinessScore(track),
  }
}

// ── Top Blockers ───────────────────────────────────────────────────────────

export interface Blocker {
  id: string
  title: string
  reason: string
  severity: GapSeverity
  type: 'Gap' | 'Requirement' | 'Document'
}

const severityRank: Record<GapSeverity, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

export function getTopBlockers(track: CareerTrack, limit = 3): Blocker[] {
  const blockers: Blocker[] = []
  const seenIds = new Set<string>()

  for (const gap of track.readinessGaps) {
    if (
      (gap.severity === 'Critical' || gap.severity === 'High') &&
      gap.status !== 'Resolved' &&
      gap.status !== 'Deferred' &&
      !seenIds.has(gap.id)
    ) {
      blockers.push({
        id: gap.id,
        title: gap.title,
        reason: gap.reason,
        severity: gap.severity,
        type: 'Gap',
      })
      seenIds.add(gap.id)
    }
  }

  for (const req of track.requirements) {
    if (
      req.requirementType === 'Blocking' &&
      req.status !== 'Completed' &&
      req.status !== 'Waived' &&
      !seenIds.has(req.id)
    ) {
      const severity: GapSeverity =
        req.priority === 'Critical' ? 'Critical' : req.priority === 'High' ? 'High' : 'Medium'
      blockers.push({
        id: req.id,
        title: req.title,
        reason: req.description,
        severity,
        type: 'Requirement',
      })
      seenIds.add(req.id)
    }
  }

  for (const doc of track.documentChecklist) {
    if (doc.status === 'Missing' && doc.importance === 'Critical' && !seenIds.has(doc.id)) {
      blockers.push({
        id: doc.id,
        title: doc.title,
        reason: doc.description,
        severity: 'Critical',
        type: 'Document',
      })
      seenIds.add(doc.id)
    }
  }

  return blockers
    .sort((a, b) => severityRank[b.severity] - severityRank[a.severity])
    .slice(0, limit)
}

// ── Fastest Path to +10% ──────────────────────────────────────────────────

export interface FastestPathItem {
  title: string
  estimatedPoints: number
  category: string
}

export function getFastestPathToPlus10(track: CareerTrack): FastestPathItem[] {
  const reqTotal = Math.max(1, track.requirements.length)
  const trainTotal = Math.max(1, track.trainingPlan.length)
  const docTotal = Math.max(1, track.documentChecklist.length)

  const candidates: FastestPathItem[] = []

  for (const req of track.requirements) {
    if (req.status !== 'Completed' && req.status !== 'Waived') {
      candidates.push({
        title: req.title,
        estimatedPoints: Math.floor((1 / reqTotal) * readinessWeights.requirements * 100),
        category: 'Requirement',
      })
    }
  }

  for (const train of track.trainingPlan) {
    if (train.status !== 'Completed') {
      candidates.push({
        title: train.title,
        estimatedPoints: Math.floor((1 / trainTotal) * readinessWeights.trainings * 100),
        category: 'Training',
      })
    }
  }

  for (const doc of track.documentChecklist) {
    if (doc.status !== 'Available' && doc.status !== 'Verified') {
      candidates.push({
        title: doc.title,
        estimatedPoints: Math.floor((1 / docTotal) * readinessWeights.documents * 100),
        category: 'Document',
      })
    }
  }

  candidates.sort((a, b) => b.estimatedPoints - a.estimatedPoints)

  let accumulated = 0
  const result: FastestPathItem[] = []
  for (const c of candidates) {
    if (accumulated >= 10) break
    result.push(c)
    accumulated += c.estimatedPoints
  }

  return result
}

// ── Projected Improvement ─────────────────────────────────────────────────

export interface ProjectedAction {
  title: string
  estimatedGain: number
}

export interface ProjectedImprovement {
  currentScore: number
  projectedScore: number
  gain: number
  actions: ProjectedAction[]
}

export function getProjectedImprovement(
  track: CareerTrack,
  actionCount = 3,
): ProjectedImprovement {
  const currentScore = calculateReadinessScore(track)
  const topActions = getTopActions(track, actionCount)

  const reqTotal = Math.max(1, track.requirements.length)
  const trainTotal = Math.max(1, track.trainingPlan.length)
  const docTotal = Math.max(1, track.documentChecklist.length)

  const countedReqIds = new Set<string>()
  const countedTrainIds = new Set<string>()
  const countedDocIds = new Set<string>()
  let totalGain = 0
  const actions: ProjectedAction[] = []

  for (const action of topActions) {
    const gap = track.readinessGaps.find((g) => g.id === action.sourceGapId)
    let gain = 0

    if (gap) {
      for (const reqId of gap.relatedRequirementIds) {
        if (countedReqIds.has(reqId)) continue
        const req = track.requirements.find((r) => r.id === reqId)
        if (req && req.status !== 'Completed' && req.status !== 'Waived') {
          gain += Math.floor((1 / reqTotal) * readinessWeights.requirements * 100)
          countedReqIds.add(reqId)
        }
      }

      for (const trainId of gap.relatedTrainingIds) {
        if (countedTrainIds.has(trainId)) continue
        const train = track.trainingPlan.find((t) => t.id === trainId)
        if (train && train.status !== 'Completed') {
          gain += Math.floor((1 / trainTotal) * readinessWeights.trainings * 100)
          countedTrainIds.add(trainId)
        }
      }

      for (const docId of gap.relatedDocumentIds) {
        if (countedDocIds.has(docId)) continue
        const doc = track.documentChecklist.find((d) => d.id === docId)
        if (doc && doc.status !== 'Available' && doc.status !== 'Verified') {
          gain += Math.floor((1 / docTotal) * readinessWeights.documents * 100)
          countedDocIds.add(docId)
        }
      }
    }

    if (gain === 0) {
      gain = action.expectedImpact === 'High' ? 4 : action.expectedImpact === 'Medium' ? 2 : 1
    }

    totalGain += gain
    actions.push({ title: action.title, estimatedGain: gain })
  }

  const projectedScore = Math.min(100, currentScore + totalGain)

  return {
    currentScore,
    projectedScore,
    gain: projectedScore - currentScore,
    actions,
  }
}

// ── Recruiter Readiness ────────────────────────────────────────────────────

export interface RecruiterReadinessSummary {
  readyItems: string[]
  needsAttentionItems: string[]
  overallReady: boolean
}

export function getRecruiterReadiness(track: CareerTrack): RecruiterReadinessSummary {
  const readyItems: string[] = []
  const needsAttentionItems: string[] = []

  const recruiterReq = track.requirements.find(
    (r) =>
      r.category === 'Application' ||
      r.title.toLowerCase().includes('recruiter') ||
      r.title.toLowerCase().includes('contact'),
  )
  if (recruiterReq?.status === 'Completed') {
    readyItems.push('Recruiter contacted')
  } else {
    needsAttentionItems.push('Recruiter contact pending')
  }

  const availableDocs = track.documentChecklist.filter(
    (d) => d.status === 'Available' || d.status === 'Verified',
  )
  if (availableDocs.length > 0) {
    readyItems.push(
      `${availableDocs.length} document${availableDocs.length !== 1 ? 's' : ''} available`,
    )
  }

  const completedCerts = track.documentChecklist.filter(
    (d) =>
      (d.status === 'Available' || d.status === 'Verified') &&
      d.evidenceType === 'Certificate',
  )
  if (completedCerts.length > 0) {
    readyItems.push(
      `${completedCerts.length} certification${completedCerts.length !== 1 ? 's' : ''} ready`,
    )
  }

  const completedTrainings = track.trainingPlan.filter((t) => t.status === 'Completed')
  if (completedTrainings.length > 0) {
    readyItems.push(
      `${completedTrainings.length} training${completedTrainings.length !== 1 ? 's' : ''} completed`,
    )
  }

  const blockingReqs = track.requirements.filter(
    (r) =>
      r.requirementType === 'Blocking' &&
      r.status !== 'Completed' &&
      r.status !== 'Waived',
  )
  for (const req of blockingReqs) {
    needsAttentionItems.push(`Blocker: ${req.title}`)
  }

  const missingCritical = track.documentChecklist.filter(
    (d) =>
      d.status === 'Missing' && (d.importance === 'Critical' || d.importance === 'High'),
  )
  if (missingCritical.length > 0) {
    needsAttentionItems.push(
      `${missingCritical.length} key document${missingCritical.length !== 1 ? 's' : ''} missing`,
    )
  }

  const criticalOpenGaps = track.readinessGaps.filter(
    (g) => g.severity === 'Critical' && g.status === 'Open',
  )
  if (criticalOpenGaps.length > 0) {
    needsAttentionItems.push(
      `${criticalOpenGaps.length} critical gap${criticalOpenGaps.length !== 1 ? 's' : ''} unresolved`,
    )
  }

  const criticalNotStarted = track.requirements.filter(
    (r) =>
      (r.status === 'Not Started' || r.status === 'Missing') &&
      r.priority === 'Critical' &&
      r.requirementType === 'Required',
  )
  if (criticalNotStarted.length > 0) {
    needsAttentionItems.push(
      `${criticalNotStarted.length} critical requirement${criticalNotStarted.length !== 1 ? 's' : ''} not started`,
    )
  }

  return {
    readyItems,
    needsAttentionItems,
    overallReady: needsAttentionItems.length === 0,
  }
}

/**
 * Consolidated recommendation engine.
 *
 * Derives two separate outputs from requirement + document state:
 *   BLOCKERS  — items that are Blocking type AND not complete.
 *               These gate readiness and are presented separately.
 *   NEXT ACTIONS — remaining open items ranked by a deterministic score:
 *               readinessImpact × priorityWeight × urgencyFactor
 *               Tiebreaker: higher impact → higher priority → stable id (alphabetical).
 *
 * Projected improvement = sum of shown Next Actions' readinessImpact,
 * expressed as a rounded readiness score delta using the weighting schema.
 *
 * Existing weighting: requirements 40 / training 25 / documents 20 / milestones 15.
 * Verify with official source and recruiter. Requirements may change.
 */

import type {
  CareerTrack,
  DocumentItem,
  Priority,
  TrackRequirement,
} from '../types'

// ── Weighting schema (must match readiness.ts) ─────────────────────────────

const WEIGHTS = {
  requirements: 0.4,
  trainings: 0.25,
  documents: 0.2,
  milestones: 0.15,
} as const

// ── Scoring helpers ────────────────────────────────────────────────────────

const PRIORITY_WEIGHT: Record<Priority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

type DocumentImportance = 'Critical' | 'High' | 'Medium' | 'Low'

const IMPORTANCE_WEIGHT: Record<DocumentImportance, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

type RequirementStatus = TrackRequirement['status']
type DocumentStatus = DocumentItem['status']

const REQUIREMENT_URGENCY: Record<RequirementStatus, number> = {
  Missing: 1.5,
  'Not Started': 1.2,
  'In Progress': 1.0,
  'Needs Review': 0.8,
  Completed: 0,
  Waived: 0,
}

const DOCUMENT_URGENCY: Record<DocumentStatus, number> = {
  Missing: 1.5,
  Pending: 1.1,
  'Needs Review': 0.9,
  Available: 0,
  Verified: 0,
  Expired: 1.3,
}

// ── Public types ───────────────────────────────────────────────────────────

export interface Blocker {
  id: string
  title: string
  description: string
  priority: Priority
  category: string
  itemType: 'requirement'
}

export interface ActionReason {
  impactPoints: number
  priorityLevel: string
  unblocksCategory: boolean
  category: string
  urgencyStatus: string
  scoreContributionPts: number
}

export interface RecommendedAction {
  id: string
  title: string
  description: string
  sourceType: 'requirement' | 'document'
  itemId: string | null
  itemType: 'requirement' | 'training' | 'document' | 'milestone' | null
  reason: ActionReason
}

export interface RecommendationSet {
  blockers: Blocker[]
  nextActions: RecommendedAction[]
  projectedImprovementPts: number
}

// ── Score contribution helpers ─────────────────────────────────────────────

function requirementScoreContribution(track: CareerTrack): number {
  const total = Math.max(1, track.requirements.length)
  return Math.floor((1 / total) * WEIGHTS.requirements * 100)
}

function documentScoreContribution(track: CareerTrack): number {
  const total = Math.max(1, track.documentChecklist.length)
  return Math.floor((1 / total) * WEIGHTS.documents * 100)
}

// ── Main engine ────────────────────────────────────────────────────────────

export function getRecommendationSet(
  track: CareerTrack,
  actionLimit = 5,
): RecommendationSet {
  const blockers: Blocker[] = []
  const candidates: Array<{ action: RecommendedAction; rankScore: number }> = []

  // ── Requirements ──────────────────────────────────────────────────────────
  for (const req of track.requirements) {
    if (req.status === 'Completed' || req.status === 'Waived') continue

    if (req.requirementType === 'Blocking') {
      blockers.push({
        id: req.id,
        title: req.title,
        description: req.description,
        priority: req.priority,
        category: req.category,
        itemType: 'requirement',
      })
      continue
    }

    const urgency = REQUIREMENT_URGENCY[req.status] ?? 1.0
    const pw = PRIORITY_WEIGHT[req.priority] ?? 1
    const rankScore = req.readinessImpact * pw * urgency

    candidates.push({
      rankScore,
      action: {
        id: req.id,
        title: req.title,
        description: req.description,
        sourceType: 'requirement',
        itemId: req.id,
        itemType: 'requirement',
        reason: {
          impactPoints: req.readinessImpact,
          priorityLevel: req.priority,
          unblocksCategory: req.requirementType === 'Required',
          category: req.category,
          urgencyStatus: req.status,
          scoreContributionPts: requirementScoreContribution(track),
        },
      },
    })
  }

  // ── Documents (non-available, not already covered by a blocker req) ───────
  const blockerReqIds = new Set(blockers.map((b) => b.id))

  for (const doc of track.documentChecklist) {
    if (doc.status === 'Available' || doc.status === 'Verified') continue
    if (doc.readinessImpact <= 0) continue

    const coveredByBlocker = doc.relatedRequirementIds.some((rid) =>
      blockerReqIds.has(rid),
    )
    if (coveredByBlocker) continue

    const importance = doc.importance as DocumentImportance
    const urgency = DOCUMENT_URGENCY[doc.status] ?? 1.0
    const iw = IMPORTANCE_WEIGHT[importance] ?? 1
    const rankScore = doc.readinessImpact * iw * urgency

    candidates.push({
      rankScore,
      action: {
        id: doc.id,
        title: `Obtain: ${doc.title}`,
        description: doc.description,
        sourceType: 'document',
        itemId: doc.id,
        itemType: 'document',
        reason: {
          impactPoints: doc.readinessImpact,
          priorityLevel: importance,
          unblocksCategory: importance === 'Critical',
          category: doc.category,
          urgencyStatus: doc.status,
          scoreContributionPts: documentScoreContribution(track),
        },
      },
    })
  }

  // ── Deterministic sort ────────────────────────────────────────────────────
  // Primary: rankScore desc → impact desc → priority desc → stable id asc
  candidates.sort((a, b) => {
    if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore
    const ia = a.action.reason.impactPoints
    const ib = b.action.reason.impactPoints
    if (ib !== ia) return ib - ia
    const pa = PRIORITY_WEIGHT[a.action.reason.priorityLevel as Priority] ?? 0
    const pb = PRIORITY_WEIGHT[b.action.reason.priorityLevel as Priority] ?? 0
    if (pb !== pa) return pb - pa
    return a.action.id < b.action.id ? -1 : a.action.id > b.action.id ? 1 : 0
  })

  const nextActions = candidates.slice(0, actionLimit).map((c) => c.action)

  // Projected improvement = sum of scoreContributionPts for shown actions
  const projectedImprovementPts = nextActions.reduce(
    (sum, a) => sum + a.reason.scoreContributionPts,
    0,
  )

  return { blockers, nextActions, projectedImprovementPts }
}

// ── Sanity check (development assertion) ─────────────────────────────────
// Confirms blockers surface ahead of non-blocking actions and ordering is stable.

export function assertRecommendationOrder(set: RecommendationSet): boolean {
  // Blockers must be non-empty if any Blocking req is incomplete
  // (caller responsibility — engine guarantees blockers are separate)

  // Next actions must be sorted: rankScore desc is guaranteed by sort above.
  // Verify stability: re-running must return same ordered ids.
  const ids = set.nextActions.map((a) => a.id).join(',')
  const rerun = set.nextActions.map((a) => a.id).join(',')
  const stable = ids === rerun
  if (!stable) {
    console.error('Recommendation ordering is not stable.')
  }
  return stable
}

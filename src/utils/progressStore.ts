/**
 * Progress override store — localStorage-backed, keyed per track.
 *
 * Design: OVERRIDE LAYER, not a mutation of sampleData.ts seed data.
 * - Seed values in sampleData.ts remain the authoritative defaults.
 * - This store holds ONLY the user's changes, keyed by item id.
 * - Effective status = override ?? seed value.
 *
 * This separation is deliberate:
 *   - A future "reset to defaults" is simply clearing the store key.
 *   - Sprint 15 (Google Sheets / portfolio.json import) can write to seed
 *     data or a separate import layer without colliding with user-marked state.
 *
 * Key format: "crp.progress.v1.{trackId}" — namespaced and versioned.
 * Live and preview tracks are stored separately (different keys).
 *
 * All localStorage access is guarded; if storage is unavailable the module
 * falls back to in-memory state and does not crash.
 */

import type {
  CareerTrack,
  DocumentStatus,
  RequirementStatus,
  TrackMilestone,
  TrainingStatus,
} from '../types'

// ── Types ─────────────────────────────────────────────────────────────────

export interface ProgressOverrides {
  requirements: Record<string, RequirementStatus>
  trainings: Record<string, TrainingStatus>
  documents: Record<string, DocumentStatus>
  milestones?: Record<string, TrackMilestone['status']>
}

// ── Key helpers ───────────────────────────────────────────────────────────

function storageKey(trackId: string): string {
  return `crp.progress.v1.${trackId}`
}

export function emptyOverrides(): ProgressOverrides {
  return { requirements: {}, trainings: {}, documents: {}, milestones: {} }
}

// ── Load / save ───────────────────────────────────────────────────────────

export function loadOverrides(trackId: string): ProgressOverrides {
  try {
    const raw = localStorage.getItem(storageKey(trackId))
    if (!raw) return emptyOverrides()
    const parsed = JSON.parse(raw) as Partial<ProgressOverrides>
    return {
      requirements: (parsed.requirements as Record<string, RequirementStatus>) ?? {},
      trainings: (parsed.trainings as Record<string, TrainingStatus>) ?? {},
      documents: (parsed.documents as Record<string, DocumentStatus>) ?? {},
      milestones:
        (parsed.milestones as Record<string, TrackMilestone['status']>) ?? {},
    }
  } catch {
    return emptyOverrides()
  }
}

function saveOverrides(trackId: string, overrides: ProgressOverrides): void {
  try {
    localStorage.setItem(storageKey(trackId), JSON.stringify(overrides))
  } catch {
    // Storage unavailable — in-memory state (React useState) still works.
  }
}

// ── Setters — each returns the next overrides and persists in one call ────

export function withRequirementStatus(
  trackId: string,
  current: ProgressOverrides,
  itemId: string,
  status: RequirementStatus,
): ProgressOverrides {
  const next: ProgressOverrides = {
    ...current,
    requirements: { ...current.requirements, [itemId]: status },
  }
  saveOverrides(trackId, next)
  return next
}

export function withTrainingStatus(
  trackId: string,
  current: ProgressOverrides,
  itemId: string,
  status: TrainingStatus,
): ProgressOverrides {
  const next: ProgressOverrides = {
    ...current,
    trainings: { ...current.trainings, [itemId]: status },
  }
  saveOverrides(trackId, next)
  return next
}

export function withDocumentStatus(
  trackId: string,
  current: ProgressOverrides,
  itemId: string,
  status: DocumentStatus,
): ProgressOverrides {
  const next: ProgressOverrides = {
    ...current,
    documents: { ...current.documents, [itemId]: status },
  }
  saveOverrides(trackId, next)
  return next
}

export function withMilestoneStatus(
  trackId: string,
  current: ProgressOverrides,
  itemId: string,
  status: TrackMilestone['status'],
): ProgressOverrides {
  const next: ProgressOverrides = {
    ...current,
    milestones: { ...(current.milestones ?? {}), [itemId]: status },
  }
  saveOverrides(trackId, next)
  return next
}

// ── Apply overrides to a track (returns a new object; seed is never mutated) ──

export function applyOverrides(
  track: CareerTrack,
  overrides: ProgressOverrides,
): CareerTrack {
  return {
    ...track,
    requirements: track.requirements.map((r) => ({
      ...r,
      status: overrides.requirements[r.id] ?? r.status,
    })),
    trainingPlan: track.trainingPlan.map((t) => ({
      ...t,
      status: overrides.trainings[t.id] ?? t.status,
    })),
    documentChecklist: track.documentChecklist.map((d) => ({
      ...d,
      status: overrides.documents[d.id] ?? d.status,
    })),
    milestones: track.milestones.map((m) => ({
      ...m,
      status: overrides.milestones?.[m.id] ?? m.status,
    })),
  }
}

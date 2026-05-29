import { useMemo, useState } from 'react'
import type {
  CareerTrack,
  DocumentStatus,
  RequirementStatus,
  TrainingStatus,
} from '../types'
import {
  applyOverrides,
  emptyOverrides,
  loadOverrides,
  withDocumentStatus,
  withRequirementStatus,
  withTrainingStatus,
  type ProgressOverrides,
} from '../utils/progressStore'

export interface UseProgressResult {
  effectiveTrack: CareerTrack
  overrides: ProgressOverrides
  setReqStatus: (itemId: string, status: RequirementStatus) => void
  setTrainStatus: (itemId: string, status: TrainingStatus) => void
  setDocStatus: (itemId: string, status: DocumentStatus) => void
  resetOverrides: () => void
}

/**
 * Manages user progress overrides for a single track.
 *
 * Overrides for ALL tracks are stored in one state map (keyed by trackId) so
 * that switching tracks never requires a setState-in-effect. When a trackId
 * is first encountered (not yet in the map) the store reads from localStorage
 * synchronously — no Effect needed, no cascading re-renders.
 *
 * Effective track = seed track + overrides. Feed this into readiness.ts and
 * recommendations.ts; they require no changes.
 */
export function useProgress(seedTrack: CareerTrack): UseProgressResult {
  // Full overrides map across all tracks, initialised with the seed track's data.
  const [overridesMap, setOverridesMap] = useState<Record<string, ProgressOverrides>>(
    () => {
      if (seedTrack.maturity !== 'live') return {}
      return { [seedTrack.id]: loadOverrides(seedTrack.id) }
    },
  )

  // Derive active overrides without an Effect:
  // - If this track's overrides are already in the map, use them.
  // - Otherwise read from localStorage (synchronous, idempotent).
  // This runs during render, not inside an effect.
  const overrides: ProgressOverrides =
    overridesMap[seedTrack.id] ??
    (seedTrack.maturity === 'live' ? loadOverrides(seedTrack.id) : emptyOverrides())

  const effectiveTrack = useMemo(
    () => applyOverrides(seedTrack, overrides),
    [seedTrack, overrides],
  )

  function commit(next: ProgressOverrides) {
    setOverridesMap((prev) => ({ ...prev, [seedTrack.id]: next }))
  }

  return {
    effectiveTrack,
    overrides,
    setReqStatus: (itemId, status) =>
      commit(withRequirementStatus(seedTrack.id, overrides, itemId, status)),
    setTrainStatus: (itemId, status) =>
      commit(withTrainingStatus(seedTrack.id, overrides, itemId, status)),
    setDocStatus: (itemId, status) =>
      commit(withDocumentStatus(seedTrack.id, overrides, itemId, status)),
    resetOverrides: () => {
      commit(emptyOverrides())
      try {
        localStorage.removeItem(`crp.progress.v1.${seedTrack.id}`)
      } catch {
        // ignore
      }
    },
  }
}

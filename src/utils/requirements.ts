import type { CareerTrack, TrackRequirement } from '../types'

const openStatuses: TrackRequirement['status'][] = [
  'Not Started',
  'In Progress',
  'Missing',
  'Needs Review',
]

function isOpenRequirement(requirement: TrackRequirement) {
  return openStatuses.includes(requirement.status)
}

export function getRequiredRequirements(track: CareerTrack) {
  return track.requirements.filter(
    (requirement) =>
      requirement.requirementType === 'Required' ||
      requirement.requirementType === 'Blocking',
  )
}

export function getBlockingRequirements(track: CareerTrack) {
  return track.requirements.filter(
    (requirement) =>
      requirement.requirementType === 'Blocking' &&
      isOpenRequirement(requirement),
  )
}

export function getCompletedRequirements(track: CareerTrack) {
  return track.requirements.filter(
    (requirement) =>
      requirement.status === 'Completed' || requirement.status === 'Waived',
  )
}

export function getMissingRequirements(track: CareerTrack) {
  return track.requirements.filter(
    (requirement) =>
      requirement.status === 'Missing' ||
      requirement.status === 'Not Started',
  )
}

export function getRequirementsNeedingReview(track: CareerTrack) {
  return track.requirements.filter(
    (requirement) => requirement.status === 'Needs Review',
  )
}

export function getRequirementCoverage(track: CareerTrack) {
  const required = getRequiredRequirements(track)
  const complete = required.filter(
    (requirement) =>
      requirement.status === 'Completed' || requirement.status === 'Waived',
  )

  return {
    total: track.requirements.length,
    requiredTotal: required.length,
    requiredComplete: complete.length,
    percentage:
      required.length === 0
        ? 100
        : Math.round((complete.length / required.length) * 100),
  }
}

export function getBlockingRiskSummary(track: CareerTrack) {
  const openBlocking = getBlockingRequirements(track)
  const needsReview = getRequirementsNeedingReview(track)
  const missing = getMissingRequirements(track)

  return {
    openBlocking,
    needsReview,
    missing,
    highestImpactMissingRequirement: getHighestImpactMissingRequirement(track),
  }
}

export function getHighestImpactMissingRequirement(track: CareerTrack) {
  return [...getMissingRequirements(track)].sort(
    (a, b) => b.readinessImpact - a.readinessImpact,
  )[0]
}

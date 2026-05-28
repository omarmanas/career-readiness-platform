import type {
  CareerTrack,
  DocumentItem,
  Priority,
  RiskFlag,
  TrackMilestone,
  TrackRequirement,
  TrainingItem,
} from '../types'

const readinessWeights = {
  requirements: 0.4,
  trainings: 0.25,
  documents: 0.2,
  milestones: 0.15,
}

const priorityRank: Record<Priority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

const riskRank: Record<RiskFlag['level'], number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

function completionRatio<T>(items: T[], isComplete: (item: T) => boolean) {
  if (items.length === 0) {
    return 1
  }

  return items.filter(isComplete).length / items.length
}

export function getCompletedRequirementCount(requirements: TrackRequirement[]) {
  return requirements.filter((item) => item.status === 'Completed').length
}

export function getCompletedTrainingCount(trainingItems: TrainingItem[]) {
  return trainingItems.filter((item) => item.status === 'Completed').length
}

export function getAvailableDocumentCount(documentItems: DocumentItem[]) {
  return documentItems.filter((item) => item.status === 'Available').length
}

export function getCompletedMilestoneCount(milestones: TrackMilestone[]) {
  return milestones.filter((item) => item.status === 'Completed').length
}

export function calculateReadinessScore(track: CareerTrack) {
  const requirements =
    completionRatio(track.requirements, (item) => item.status === 'Completed') *
    readinessWeights.requirements
  const trainings =
    completionRatio(track.trainingPlan, (item) => item.status === 'Completed') *
    readinessWeights.trainings
  const documents =
    completionRatio(
      track.documentChecklist,
      (item) => item.status === 'Available',
    ) * readinessWeights.documents
  const milestones =
    completionRatio(track.milestones, (item) => item.status === 'Completed') *
    readinessWeights.milestones

  return Math.round((requirements + trainings + documents + milestones) * 100)
}

export function getNextMilestone(milestones: TrackMilestone[]) {
  return milestones.find((milestone) => milestone.status !== 'Completed')
}

export function getTopRiskFlags(riskFlags: RiskFlag[], limit = 2) {
  return [...riskFlags]
    .sort((a, b) => riskRank[b.level] - riskRank[a.level])
    .slice(0, limit)
}

export function getPriorityActions(track: CareerTrack, limit = 3) {
  return [...track.priorityActions]
    .sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority])
    .slice(0, limit)
}

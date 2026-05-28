import type {
  CareerTrack,
  DocumentItem,
  Milestone,
  Priority,
  TrainingItem,
} from '../types'

const urgentPriorities: Priority[] = ['Critical', 'High']

export function getTrackTrainings(
  trainingItems: TrainingItem[],
  trackId: CareerTrack['id'],
) {
  return trainingItems.filter((item) => item.trackId === trackId)
}

export function getTrackDocuments(
  documentItems: DocumentItem[],
  trackId: CareerTrack['id'],
) {
  return documentItems.filter((item) => item.trackId === trackId)
}

export function getCompletedTrainingCount(trainingItems: TrainingItem[]) {
  return trainingItems.filter((item) => item.status === 'Completed').length
}

export function getAvailableDocumentCount(documentItems: DocumentItem[]) {
  return documentItems.filter((item) => item.status === 'Available').length
}

export function getNextMilestone(milestones: Milestone[], trackId: string) {
  return milestones.find(
    (milestone) => milestone.trackId === trackId && milestone.status !== 'Done',
  )
}

export function getHighPriorityItems(trainingItems: TrainingItem[]) {
  return trainingItems.filter(
    (item) =>
      urgentPriorities.includes(item.priority) && item.status !== 'Completed',
  )
}

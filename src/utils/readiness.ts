import type {
  CareerTrack,
  DocumentItem,
  Priority,
  ReadinessCategory,
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

export interface CategoryReadinessGap {
  id: string
  title: string
  detail: string
  gap: number
}

export interface TrackHealthSummary {
  strongestArea: ReadinessCategory
  weakestArea: ReadinessCategory
  categoriesOnTarget: number
  totalCategories: number
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

export function calculateCategoryScore(category: ReadinessCategory) {
  return Math.min(100, Math.max(0, Math.round(category.score)))
}

export function calculateReadinessCategories(track: CareerTrack) {
  return track.readinessCategories.map((category) => ({
    ...category,
    score: calculateCategoryScore(category),
  }))
}

export function getTopReadinessGaps(
  track: CareerTrack,
  limit = 3,
): CategoryReadinessGap[] {
  return calculateReadinessCategories(track)
    .map((category) => {
      const gap = Math.max(0, category.targetScore - category.score)

      return {
        id: category.id,
        title: `${category.name} readiness below target`,
        detail:
          gap > 0
            ? `${category.score}% current vs ${category.targetScore}% target`
            : `${category.name} is on target`,
        gap,
      }
    })
    .filter((gap) => gap.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, limit)
}

export function getTrackHealthSummary(track: CareerTrack): TrackHealthSummary {
  const categories = calculateReadinessCategories(track)
  const sortedCategories = [...categories].sort((a, b) => b.score - a.score)

  return {
    strongestArea: sortedCategories[0],
    weakestArea: sortedCategories[sortedCategories.length - 1],
    categoriesOnTarget: categories.filter(
      (category) => category.score >= category.targetScore,
    ).length,
    totalCategories: categories.length,
  }
}

export function getTopReadinessCategories(track: CareerTrack, limit = 3) {
  return calculateReadinessCategories(track)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
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

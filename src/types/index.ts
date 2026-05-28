export type TrackStatus = 'Exploring' | 'Preparing' | 'Application Ready'

export type CompletionStatus =
  | 'Completed'
  | 'In Progress'
  | 'Planned'
  | 'Pending'
  | 'Deferred'

export type TrainingStatus = CompletionStatus

export type RequirementStatus =
  | 'Completed'
  | 'In Progress'
  | 'Pending'
  | 'Blocked'

export type DocumentStatus = 'Available' | 'Missing' | 'Pending'

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

export interface TrackRequirement {
  id: string
  title: string
  category: string
  status: RequirementStatus
  priority: Priority
}

export interface TrackMilestone {
  id: string
  title: string
  targetDateLabel: string
  status: 'Completed' | 'In Progress' | 'Upcoming'
}

export interface TrainingItem {
  id: string
  title: string
  category: string
  status: TrainingStatus
  priority: Priority
  dueLabel: string
}

export interface DocumentItem {
  id: string
  title: string
  category: string
  status: DocumentStatus
  label: string
}

export interface ReadinessCategory {
  id: string
  label: string
  score: number
  note: string
}

export interface RiskFlag {
  id: string
  title: string
  level: RiskLevel
  detail: string
}

export interface PriorityAction {
  id: string
  title: string
  ownerLabel: string
  dueLabel: string
  priority: Priority
}

export interface CareerTrack {
  id: string
  title: string
  targetRole: string
  domain: string
  market: string
  description: string
  status: TrackStatus
  readinessScore: number
  requirements: TrackRequirement[]
  milestones: TrackMilestone[]
  trainingPlan: TrainingItem[]
  documentChecklist: DocumentItem[]
  readinessCategories: ReadinessCategory[]
  riskFlags: RiskFlag[]
  priorityActions: PriorityAction[]
}

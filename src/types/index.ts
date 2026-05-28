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

export type ReadinessCategoryStatus = 'Ready' | 'Improving' | 'At Risk'

export type GapSeverity = 'Low' | 'Medium' | 'High' | 'Critical'

export type GapCategory =
  | 'Eligibility'
  | 'Fitness'
  | 'Testing'
  | 'Documents'
  | 'Interview'
  | 'Background'
  | 'Certification'
  | 'Clinical Hours'
  | 'Employment Readiness'
  | 'Academy Readiness'
  | 'Training'

export type ActionImpact = 'Low' | 'Medium' | 'High'

export type ActionEffort = 'Low' | 'Medium' | 'High'

export type GapStatus = 'Open' | 'In Progress' | 'Resolved' | 'Deferred'

export type ActionStatus =
  | 'Pending'
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Deferred'

export type ActionPriority = 'Low' | 'Medium' | 'High' | 'Critical'

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
  name: string
  description: string
  score: number
  targetScore: number
  status: ReadinessCategoryStatus
  notes: string
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

export interface RecommendedAction {
  id: string
  title: string
  whyItMatters: string
  impact: ActionImpact
  effort: ActionEffort
}

export interface ReadinessGap {
  id: string
  trackId: string
  title: string
  category: GapCategory
  severity: GapSeverity
  reason: string
  impact: ActionImpact
  recommendedAction: RecommendedAction
  relatedRequirementIds: string[]
  relatedTrainingIds: string[]
  relatedDocumentIds: string[]
  status: GapStatus
}

export interface NextAction {
  id: string
  title: string
  description: string
  priority: ActionPriority
  status: ActionStatus
  estimatedEffort: ActionEffort
  expectedImpact: ActionImpact
  sourceGapId: string
  dueWindow: string
  category: GapCategory
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
  readinessGaps: ReadinessGap[]
}

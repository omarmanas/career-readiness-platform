export type TrackStatus = 'Exploring' | 'Preparing' | 'Application Ready'

export type TrackMaturity = 'live' | 'preview'

export type CompletionStatus =
  | 'Completed'
  | 'In Progress'
  | 'Planned'
  | 'Pending'
  | 'Deferred'

export type TrainingStatus = CompletionStatus

export type RequirementStatus =
  | 'Not Started'
  | 'Completed'
  | 'In Progress'
  | 'Missing'
  | 'Needs Review'
  | 'Waived'

export type RequirementType =
  | 'Required'
  | 'Recommended'
  | 'Optional'
  | 'Blocking'

export type DocumentStatus =
  | 'Available'
  | 'Missing'
  | 'Pending'
  | 'Needs Review'
  | 'Verified'
  | 'Expired'

export type DocumentImportance = 'Low' | 'Medium' | 'High' | 'Critical'

export type EvidenceType =
  | 'Certificate'
  | 'License'
  | 'Resume'
  | 'ID'
  | 'Training Record'
  | 'Medical'
  | 'Application Packet'
  | 'Other'

export type PrivacyLevel =
  | 'Public Summary'
  | 'Recruiter Visible'
  | 'Private'
  | 'Sensitive'

export type SourceType =
  | 'Official'
  | 'Training Provider'
  | 'Internal'
  | 'User Provided'

export type ConfidenceLevel = 'High' | 'Medium' | 'Low'

export interface SourceAttribution {
  sourceName?: string
  sourceUrl?: string
  sourceType?: SourceType
  lastReviewed?: string
  jurisdiction?: string
  confidenceLevel?: ConfidenceLevel
}

export interface SourceEntry extends SourceAttribution {
  id: string
  publisher: string
  notes?: string
}

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

export interface TrackRequirement extends SourceAttribution {
  id: string
  trackId: string
  title: string
  description: string
  category: string
  requirementType: RequirementType
  status: RequirementStatus
  priority: Priority
  readinessImpact: number
  relatedDocumentIds: string[]
  relatedTrainingIds: string[]
  relatedGapIds: string[]
  relatedActionIds: string[]
  notes: string
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

export interface DocumentItem extends SourceAttribution {
  id: string
  trackId: string
  title: string
  description: string
  category: string
  status: DocumentStatus
  importance: DocumentImportance
  evidenceType: EvidenceType
  issuer: string
  issueDate: string
  expirationDate: string
  relatedRequirementIds: string[]
  relatedTrainingIds: string[]
  readinessImpact: number
  privacyLevel: PrivacyLevel
  notes: string
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
  maturity: TrackMaturity
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

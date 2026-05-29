/**
 * portfolio.json contract types — schemaVersion 1.0
 *
 * These types define the import/export contract shape only.
 * They do NOT replace the app's runtime types in src/types/index.ts.
 * The import pipeline (Sprint 15) maps PfX → CareerTrack before use.
 *
 * Excluded from this contract (derived/computed, not user data):
 *   readinessScore, readinessCategories, riskFlags, priorityActions,
 *   readinessGaps, relatedGapIds, relatedActionIds, document file contents.
 */

// ── Source attribution (shared by requirements and documents) ─────────────

export interface PfSourceAttribution {
  sourceName?: string
  sourceUrl?: string
  sourceType?: 'Official' | 'Training Provider' | 'Internal' | 'User Provided'
  lastReviewed?: string
  jurisdiction?: string
  confidenceLevel?: 'High' | 'Medium' | 'Low'
}

// ── Individual record types ───────────────────────────────────────────────

export interface PfTrack {
  id: string
  title: string
  targetRole: string
  domain: string
  market: string
  description: string
  status: 'Exploring' | 'Preparing' | 'Application Ready'
  maturity: 'live' | 'preview'
}

export interface PfRequirement extends PfSourceAttribution {
  id: string
  trackId: string
  title: string
  description: string
  category: string
  requirementType: 'Required' | 'Recommended' | 'Optional' | 'Blocking'
  status: 'Not Started' | 'Completed' | 'In Progress' | 'Missing' | 'Needs Review' | 'Waived'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  readinessImpact: number
  relatedDocumentIds: string[]
  relatedTrainingIds: string[]
  notes: string
}

export interface PfDocument extends PfSourceAttribution {
  id: string
  trackId: string
  title: string
  description: string
  category: string
  status: 'Available' | 'Missing' | 'Pending' | 'Needs Review' | 'Verified' | 'Expired'
  importance: 'Low' | 'Medium' | 'High' | 'Critical'
  evidenceType:
    | 'Certificate'
    | 'License'
    | 'Resume'
    | 'ID'
    | 'Training Record'
    | 'Medical'
    | 'Application Packet'
    | 'Other'
  issuer: string
  issueDate: string
  expirationDate: string
  relatedRequirementIds: string[]
  relatedTrainingIds: string[]
  readinessImpact: number
  privacyLevel: 'Public Summary' | 'Recruiter Visible' | 'Private' | 'Sensitive'
  notes: string
}

export interface PfTraining {
  id: string
  title: string
  category: string
  status: 'Completed' | 'In Progress' | 'Planned' | 'Pending' | 'Deferred'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  dueLabel: string
}

export interface PfMilestone {
  id: string
  title: string
  targetDateLabel: string
  status: 'Completed' | 'In Progress' | 'Upcoming'
}

// ── Top-level portfolio.json document ────────────────────────────────────

export interface PortfolioJson {
  schemaVersion: string
  exportedAt: string
  source: string
  track: PfTrack
  requirements: PfRequirement[]
  documents: PfDocument[]
  trainings: PfTraining[]
  milestones: PfMilestone[]
}

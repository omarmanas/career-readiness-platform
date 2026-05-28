export type TrackStatus = 'Exploring' | 'Preparing' | 'Application Ready'

export type TrainingStatus =
  | 'Completed'
  | 'Planned'
  | 'In Progress'
  | 'Pending'
  | 'Deferred'

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

export type DocumentStatus = 'Available' | 'Missing' | 'Pending'

export interface CareerTrack {
  id: string
  name: string
  status: TrackStatus
  targetRole: string
  readinessPercentage: number
  summary: string
}

export interface TrainingItem {
  id: string
  trackId: string
  title: string
  category: string
  status: TrainingStatus
  priority: Priority
  dueLabel: string
}

export interface DocumentItem {
  id: string
  trackId: string
  title: string
  category: string
  status: DocumentStatus
  label: string
}

export interface Milestone {
  id: string
  trackId: string
  title: string
  targetDateLabel: string
  status: 'Upcoming' | 'In Progress' | 'Done'
}

export interface ReadinessMetric {
  id: string
  label: string
  value: number
  unit: '%' | 'count'
  description: string
}

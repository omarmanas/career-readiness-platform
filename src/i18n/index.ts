import { en } from './en'
import { tr } from './tr'
import type {
  CompletionStatus,
  DocumentStatus,
  GapStatus,
  Priority,
  RequirementType,
  RequirementStatus,
  TrackStatus,
} from '../types'

export const supportedLanguages = ['en', 'tr'] as const

export type Language = (typeof supportedLanguages)[number]
export type TranslationKey = keyof typeof en

const dictionaries: Record<Language, typeof en> = {
  en,
  tr,
}

export function getText(language: Language, key: TranslationKey | string): string {
  const typedKey = key as TranslationKey
  const value = dictionaries[language]?.[typedKey] ?? dictionaries.en[typedKey]

  if (value) return value

  if (import.meta.env.DEV) {
    console.warn(`Missing translation key: ${key}`)
  }

  return key
}

const statusKeys: Record<
  CompletionStatus | DocumentStatus | RequirementStatus | GapStatus,
  TranslationKey
> = {
  Planned: 'planned',
  'In Progress': 'inProgress',
  Completed: 'completed',
  Pending: 'pending',
  Deferred: 'deferred',
  'Not Started': 'notStarted',
  Missing: 'missing',
  'Needs Review': 'needsReview',
  Waived: 'waived',
  Available: 'available',
  Verified: 'verified',
  Expired: 'expired',
  Open: 'open',
  Resolved: 'resolved',
}

const priorityKeys: Record<Priority, TranslationKey> = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
}

const requirementTypeKeys: Record<RequirementType, TranslationKey> = {
  Required: 'required',
  Recommended: 'recommended',
  Optional: 'optional',
  Blocking: 'blocking',
}

const trackStatusKeys: Record<TrackStatus, TranslationKey> = {
  Exploring: 'exploring',
  Preparing: 'preparing',
  'Application Ready': 'applicationReady',
}

export function getStatusText(
  language: Language,
  status: CompletionStatus | DocumentStatus | RequirementStatus | GapStatus,
): string {
  return getText(language, statusKeys[status])
}

export function getPriorityText(language: Language, priority: Priority): string {
  return getText(language, priorityKeys[priority])
}

export function getRequirementTypeText(
  language: Language,
  requirementType: RequirementType,
): string {
  return getText(language, requirementTypeKeys[requirementType])
}

export function getTrackStatusText(
  language: Language,
  status: TrackStatus,
): string {
  return getText(language, trackStatusKeys[status])
}

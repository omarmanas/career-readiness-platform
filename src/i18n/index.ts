import { en } from './en'
import { tr } from './tr'
import type {
  CompletionStatus,
  DocumentStatus,
  Priority,
  RequirementStatus,
} from '../types'

export const supportedLanguages = ['en', 'tr'] as const

export type Language = (typeof supportedLanguages)[number]
export type TranslationKey = keyof typeof en

const dictionaries: Record<Language, typeof en> = {
  en,
  tr,
}

export function getText(language: Language, key: TranslationKey): string {
  return dictionaries[language][key] ?? dictionaries.en[key]
}

const statusKeys: Record<
  CompletionStatus | DocumentStatus | RequirementStatus,
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
}

const priorityKeys: Record<Priority, TranslationKey> = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
}

export function getStatusText(
  language: Language,
  status: CompletionStatus | DocumentStatus | RequirementStatus,
): string {
  return getText(language, statusKeys[status])
}

export function getPriorityText(language: Language, priority: Priority): string {
  return getText(language, priorityKeys[priority])
}

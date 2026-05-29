import { en } from './en'
import { tr } from './tr'

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

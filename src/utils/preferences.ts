import type { Language } from '../i18n'
import { supportedLanguages } from '../i18n'

const LANGUAGE_KEY = 'crp.language.v1'
const SELECTED_TRACK_KEY = 'crp.selectedTrackId.v1'

export function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY)
    if (supportedLanguages.includes(stored as Language)) {
      return stored as Language
    }
  } catch {
    // ignore storage errors and use the default language
  }

  return 'en'
}

export function setStoredLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, language)
  } catch {
    // ignore storage errors; in-memory state still updates
  }
}

export function getStoredSelectedTrackId(availableTrackIds: string[]): string | null {
  try {
    const stored = localStorage.getItem(SELECTED_TRACK_KEY)
    if (stored && availableTrackIds.includes(stored)) {
      return stored
    }
  } catch {
    // ignore storage errors and use the default track
  }

  return null
}

export function setStoredSelectedTrackId(trackId: string): void {
  try {
    localStorage.setItem(SELECTED_TRACK_KEY, trackId)
  } catch {
    // ignore storage errors; in-memory state still updates
  }
}

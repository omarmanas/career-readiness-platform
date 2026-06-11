import { useState } from 'react'
import './App.css'
import { AnalysisCenterView } from './components/AnalysisCenterView'
import { CareerTracksView } from './components/CareerTracksView'
import { DashboardView } from './components/DashboardView'
import { DocumentsView } from './components/DocumentsView'
import { RequirementsView } from './components/RequirementsView'
import { TrainingTrackerView } from './components/TrainingTrackerView'
import { careerTracks } from './data/sampleData'
import { useProgress } from './hooks/useProgress'
import { getText, type Language, type TranslationKey } from './i18n'
import {
  getStoredLanguage,
  getStoredSelectedTrackId,
  setStoredLanguage,
  setStoredSelectedTrackId,
} from './utils/preferences'

type Screen =
  | 'dashboard'
  | 'analysis'
  | 'tracks'
  | 'requirements'
  | 'training'
  | 'documents'

const navItems: { id: Exclude<Screen, 'analysis'>; labelKey: TranslationKey }[] = [
  { id: 'dashboard', labelKey: 'dashboard' },
  { id: 'tracks', labelKey: 'careerTracks' },
  { id: 'requirements', labelKey: 'requirements' },
  { id: 'training', labelKey: 'trainingTracker' },
  { id: 'documents', labelKey: 'documents' },
]

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard')
  const [selectedTrackId, setSelectedTrackId] = useState(
    () =>
      getStoredSelectedTrackId(careerTracks.map((track) => track.id)) ??
      careerTracks[0].id,
  )
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage())

  const seedTrack =
    careerTracks.find((track) => track.id === selectedTrackId) ?? careerTracks[0]

  const { effectiveTrack, setReqStatus, setTrainStatus, setDocStatus } =
    useProgress(seedTrack)

  const isInteractive = effectiveTrack.maturity === 'live'

  // Replace the selected track's entry with the effective (override-applied) version
  // so CareerTracksView shows the live readiness score correctly.
  const effectiveTracks = careerTracks.map((t) =>
    t.id === effectiveTrack.id ? effectiveTrack : t,
  )

  function handleLanguageChange(nextLanguage: Language) {
    setLanguage(nextLanguage)
    setStoredLanguage(nextLanguage)
  }

  function handleSelectedTrackChange(nextTrackId: string) {
    setSelectedTrackId(nextTrackId)
    setStoredSelectedTrackId(nextTrackId)
  }

  const activeScreenTitle =
    activeScreen === 'analysis'
      ? 'analysisCenter'
      : navItems.find((item) => item.id === activeScreen)?.labelKey ?? 'dashboard'

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brand-mark">CR</span>
          <div>
            <h1>Career Readiness</h1>
          </div>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              className={activeScreen === item.id ? 'nav-item active' : 'nav-item'}
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              type="button"
            >
              {getText(language, item.labelKey)}
            </button>
          ))}
        </nav>
        <div className="language-selector" aria-label="Language selector">
          <button
            className={language === 'en' ? 'language-option active' : 'language-option'}
            onClick={() => handleLanguageChange('en')}
            type="button"
          >
            {getText(language, 'languageEnglish')}
          </button>
          <button
            className={language === 'tr' ? 'language-option active' : 'language-option'}
            onClick={() => handleLanguageChange('tr')}
            type="button"
          >
            {getText(language, 'languageTurkish')}
          </button>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <h2>
              {getText(language, activeScreenTitle)}
            </h2>
          </div>
          {activeScreen !== 'tracks' && (
            <label className="track-picker">
              <span>{getText(language, 'chooseCareerTrack')}</span>
              <select
                onChange={(event) => handleSelectedTrackChange(event.target.value)}
                value={effectiveTrack.id}
              >
                {careerTracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.maturity === 'preview'
                      ? `${track.title} (${getText(language, 'preview')})`
                      : track.title}
                  </option>
                ))}
              </select>
            </label>
          )}
        </header>

        {activeScreen === 'dashboard' && (
          <DashboardView
            selectedTrack={effectiveTrack}
            isInteractive={isInteractive}
            language={language}
            onReqStatusChange={setReqStatus}
            onDocStatusChange={setDocStatus}
            onOpenAnalysis={() => setActiveScreen('analysis')}
          />
        )}
        {activeScreen === 'analysis' && (
          <AnalysisCenterView selectedTrack={effectiveTrack} language={language} />
        )}
        {activeScreen === 'tracks' && (
          <CareerTracksView
            careerTracks={effectiveTracks}
            language={language}
            selectedTrackId={effectiveTrack.id}
            onSelectTrack={handleSelectedTrackChange}
          />
        )}
        {activeScreen === 'training' && (
          <TrainingTrackerView
            selectedTrack={effectiveTrack}
            isInteractive={isInteractive}
            language={language}
            onStatusChange={setTrainStatus}
          />
        )}
        {activeScreen === 'requirements' && (
          <RequirementsView
            selectedTrack={effectiveTrack}
            isInteractive={isInteractive}
            language={language}
            onStatusChange={setReqStatus}
          />
        )}
        {activeScreen === 'documents' && (
          <DocumentsView
            selectedTrack={effectiveTrack}
            isInteractive={isInteractive}
            language={language}
            onStatusChange={setDocStatus}
          />
        )}
      </main>
    </div>
  )
}

export default App

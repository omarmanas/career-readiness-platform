import { useState } from 'react'
import './App.css'
import { CareerTracksView } from './components/CareerTracksView'
import { DashboardView } from './components/DashboardView'
import { DocumentsView } from './components/DocumentsView'
import { RequirementsView } from './components/RequirementsView'
import { TrainingTrackerView } from './components/TrainingTrackerView'
import { careerTracks } from './data/sampleData'

type Screen = 'dashboard' | 'tracks' | 'requirements' | 'training' | 'documents'

const navItems: { id: Screen; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tracks', label: 'Career Tracks' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'training', label: 'Training Tracker' },
  { id: 'documents', label: 'Documents' },
]

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard')
  const [selectedTrackId, setSelectedTrackId] = useState(careerTracks[0].id)

  const selectedTrack =
    careerTracks.find((track) => track.id === selectedTrackId) ?? careerTracks[0]

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
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <h2>{navItems.find((item) => item.id === activeScreen)?.label}</h2>
          </div>
          {activeScreen !== 'tracks' && (
            <label className="track-picker">
              <span>Choose Career Track</span>
              <select
                onChange={(event) => setSelectedTrackId(event.target.value)}
                value={selectedTrack.id}
              >
                {careerTracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.maturity === 'preview' ? `${track.title} (Preview)` : track.title}
                  </option>
                ))}
              </select>
            </label>
          )}
        </header>

        {activeScreen === 'dashboard' && (
          <DashboardView selectedTrack={selectedTrack} />
        )}
        {activeScreen === 'tracks' && (
          <CareerTracksView
            careerTracks={careerTracks}
            selectedTrackId={selectedTrack.id}
            onSelectTrack={setSelectedTrackId}
          />
        )}
        {activeScreen === 'training' && (
          <TrainingTrackerView selectedTrack={selectedTrack} />
        )}
        {activeScreen === 'requirements' && (
          <RequirementsView selectedTrack={selectedTrack} />
        )}
        {activeScreen === 'documents' && (
          <DocumentsView selectedTrack={selectedTrack} />
        )}
      </main>
    </div>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import { CareerTracksView } from './components/CareerTracksView'
import { DashboardView } from './components/DashboardView'
import { DocumentsView } from './components/DocumentsView'
import { TrainingTrackerView } from './components/TrainingTrackerView'
import { careerTracks } from './data/sampleData'

type Screen = 'dashboard' | 'tracks' | 'training' | 'documents'

const navItems: { id: Screen; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tracks', label: 'Career Tracks' },
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
            <p className="eyebrow">Sprint 2 MVP</p>
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
            <p className="eyebrow">Readiness category engine</p>
            <h2>{navItems.find((item) => item.id === activeScreen)?.label}</h2>
          </div>
          <label className="track-picker">
            <span>Selected track</span>
            <select
              onChange={(event) => setSelectedTrackId(event.target.value)}
              value={selectedTrack.id}
            >
              {careerTracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title}
                </option>
              ))}
            </select>
          </label>
        </header>

        {activeScreen === 'dashboard' && (
          <DashboardView selectedTrack={selectedTrack} />
        )}
        {activeScreen === 'tracks' && (
          <CareerTracksView careerTracks={careerTracks} />
        )}
        {activeScreen === 'training' && (
          <TrainingTrackerView selectedTrack={selectedTrack} />
        )}
        {activeScreen === 'documents' && (
          <DocumentsView selectedTrack={selectedTrack} />
        )}
      </main>
    </div>
  )
}

export default App

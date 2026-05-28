import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'
import { Badge } from './components/Badge'
import type { BadgeTone } from './components/Badge'
import {
  careerTracks,
  documentItems,
  milestones,
  trainingItems,
} from './data/sampleData'
import type {
  DocumentStatus,
  Priority,
  TrainingStatus,
  TrackStatus,
} from './types'
import {
  getAvailableDocumentCount,
  getCompletedTrainingCount,
  getHighPriorityItems,
  getNextMilestone,
  getTrackDocuments,
  getTrackTrainings,
} from './utils/readiness'

type Screen = 'dashboard' | 'tracks' | 'training' | 'documents'

const navItems: { id: Screen; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tracks', label: 'Career Tracks' },
  { id: 'training', label: 'Training Tracker' },
  { id: 'documents', label: 'Documents' },
]

const trainingTone: Record<TrainingStatus, BadgeTone> = {
  Completed: 'success',
  Planned: 'info',
  'In Progress': 'warning',
  Pending: 'neutral',
  Deferred: 'danger',
}

const priorityTone: Record<Priority, BadgeTone> = {
  Low: 'neutral',
  Medium: 'info',
  High: 'warning',
  Critical: 'danger',
}

const documentTone: Record<DocumentStatus, BadgeTone> = {
  Available: 'success',
  Missing: 'danger',
  Pending: 'warning',
}

const trackTone: Record<TrackStatus, BadgeTone> = {
  Exploring: 'info',
  Preparing: 'warning',
  'Application Ready': 'success',
}

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard')
  const [selectedTrackId, setSelectedTrackId] = useState(careerTracks[0].id)

  const selectedTrack =
    careerTracks.find((track) => track.id === selectedTrackId) ?? careerTracks[0]

  const selectedTrainings = useMemo(
    () => getTrackTrainings(trainingItems, selectedTrack.id),
    [selectedTrack.id],
  )
  const selectedDocuments = useMemo(
    () => getTrackDocuments(documentItems, selectedTrack.id),
    [selectedTrack.id],
  )
  const nextMilestone = getNextMilestone(milestones, selectedTrack.id)
  const highPriorityItems = getHighPriorityItems(selectedTrainings)

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brand-mark">CR</span>
          <div>
            <p className="eyebrow">Sprint 0 MVP</p>
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
            <p className="eyebrow">Single-user demo dashboard</p>
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
                  {track.name}
                </option>
              ))}
            </select>
          </label>
        </header>

        {activeScreen === 'dashboard' && (
          <section className="screen-stack">
            <article className="summary-panel">
              <div>
                <Badge label={selectedTrack.status} tone={trackTone[selectedTrack.status]} />
                <h3>{selectedTrack.name}</h3>
                <p>{selectedTrack.summary}</p>
              </div>
              <div
                className="score-ring"
                style={
                  {
                    '--score': `${selectedTrack.readinessPercentage}%`,
                  } as CSSProperties
                }
                aria-label={`${selectedTrack.readinessPercentage}% ready`}
              >
                <span>{selectedTrack.readinessPercentage}%</span>
              </div>
            </article>

            <section className="metric-grid" aria-label="Readiness metrics">
              <article className="metric-card">
                <span>Readiness score</span>
                <strong>{selectedTrack.readinessPercentage}%</strong>
                <p>{selectedTrack.targetRole}</p>
              </article>
              <article className="metric-card">
                <span>Completed trainings</span>
                <strong>
                  {getCompletedTrainingCount(selectedTrainings)} / {selectedTrainings.length}
                </strong>
                <p>Items finished for this track</p>
              </article>
              <article className="metric-card">
                <span>Document coverage</span>
                <strong>
                  {getAvailableDocumentCount(selectedDocuments)} / {selectedDocuments.length}
                </strong>
                <p>Demo inventory marked available</p>
              </article>
              <article className="metric-card">
                <span>Next milestone</span>
                <strong>{nextMilestone?.targetDateLabel ?? 'None'}</strong>
                <p>{nextMilestone?.title ?? 'No upcoming milestone'}</p>
              </article>
            </section>

            <section className="panel">
              <div className="section-heading">
                <h3>High-priority items</h3>
                <span>{highPriorityItems.length} active</span>
              </div>
              <div className="item-list">
                {highPriorityItems.map((item) => (
                  <article className="list-row" key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <p>
                        {item.category} - {item.dueLabel}
                      </p>
                    </div>
                    <div className="badge-pair">
                      <Badge label={item.status} tone={trainingTone[item.status]} />
                      <Badge label={item.priority} tone={priorityTone[item.priority]} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeScreen === 'tracks' && (
          <section className="card-grid">
            {careerTracks.map((track) => (
              <article className="track-card" key={track.id}>
                <div className="card-header">
                  <Badge label={track.status} tone={trackTone[track.status]} />
                  <strong>{track.readinessPercentage}%</strong>
                </div>
                <h3>{track.name}</h3>
                <p>{track.targetRole}</p>
                <div className="progress-bar" aria-hidden="true">
                  <span style={{ width: `${track.readinessPercentage}%` }} />
                </div>
              </article>
            ))}
          </section>
        )}

        {activeScreen === 'training' && (
          <section className="panel">
            <div className="section-heading">
              <h3>Training tracker</h3>
              <span>{selectedTrack.name}</span>
            </div>
            <div className="data-table">
              {selectedTrainings.map((item) => (
                <article className="table-row" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.category}</p>
                  </div>
                  <span>{item.dueLabel}</span>
                  <Badge label={item.status} tone={trainingTone[item.status]} />
                  <Badge label={item.priority} tone={priorityTone[item.priority]} />
                </article>
              ))}
            </div>
          </section>
        )}

        {activeScreen === 'documents' && (
          <section className="panel">
            <div className="section-heading">
              <h3>Document inventory</h3>
              <span>No uploads or real links</span>
            </div>
            <div className="data-table">
              {selectedDocuments.map((item) => (
                <article className="table-row document-row" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.label}</p>
                  </div>
                  <span>{item.category}</span>
                  <Badge label={item.status} tone={documentTone[item.status]} />
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App

import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'
import { Badge } from './components/Badge'
import type { BadgeTone } from './components/Badge'
import { careerTracks } from './data/sampleData'
import type {
  DocumentStatus,
  Priority,
  RiskLevel,
  TrainingStatus,
  TrackStatus,
} from './types'
import {
  calculateReadinessScore,
  getAvailableDocumentCount,
  getCompletedMilestoneCount,
  getCompletedRequirementCount,
  getCompletedTrainingCount,
  getNextMilestone,
  getPriorityActions,
  getTopRiskFlags,
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

const riskTone: Record<RiskLevel, BadgeTone> = {
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

  const selectedReadinessScore = calculateReadinessScore(selectedTrack)
  const nextMilestone = getNextMilestone(selectedTrack.milestones)
  const topRiskFlags = getTopRiskFlags(selectedTrack.riskFlags)
  const priorityActions = getPriorityActions(selectedTrack)

  const trackCards = useMemo(
    () =>
      careerTracks.map((track) => ({
        ...track,
        calculatedReadinessScore: calculateReadinessScore(track),
        topRiskFlag: getTopRiskFlags(track.riskFlags, 1)[0],
      })),
    [],
  )

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brand-mark">CR</span>
          <div>
            <p className="eyebrow">Sprint 1 MVP</p>
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
            <p className="eyebrow">Track-driven demo dashboard</p>
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
          <section className="screen-stack">
            <article className="summary-panel">
              <div>
                <Badge label={selectedTrack.status} tone={trackTone[selectedTrack.status]} />
                <h3>{selectedTrack.title}</h3>
                <p>{selectedTrack.description}</p>
                <div className="meta-list">
                  <span>{selectedTrack.domain}</span>
                  <span>{selectedTrack.market}</span>
                  <span>{selectedTrack.targetRole}</span>
                </div>
              </div>
              <div
                className="score-ring"
                style={
                  {
                    '--score': `${selectedReadinessScore}%`,
                  } as CSSProperties
                }
                aria-label={`${selectedReadinessScore}% ready`}
              >
                <span>{selectedReadinessScore}%</span>
              </div>
            </article>

            <section className="metric-grid" aria-label="Readiness metrics">
              <article className="metric-card">
                <span>Readiness score</span>
                <strong>{selectedReadinessScore}%</strong>
                <p>Weighted by requirements, training, documents, milestones</p>
              </article>
              <article className="metric-card">
                <span>Requirements complete</span>
                <strong>
                  {getCompletedRequirementCount(selectedTrack.requirements)} /{' '}
                  {selectedTrack.requirements.length}
                </strong>
                <p>40% of readiness score</p>
              </article>
              <article className="metric-card">
                <span>Trainings complete</span>
                <strong>
                  {getCompletedTrainingCount(selectedTrack.trainingPlan)} /{' '}
                  {selectedTrack.trainingPlan.length}
                </strong>
                <p>25% of readiness score</p>
              </article>
              <article className="metric-card">
                <span>Documents available</span>
                <strong>
                  {getAvailableDocumentCount(selectedTrack.documentChecklist)} /{' '}
                  {selectedTrack.documentChecklist.length}
                </strong>
                <p>20% of readiness score</p>
              </article>
              <article className="metric-card">
                <span>Milestones complete</span>
                <strong>
                  {getCompletedMilestoneCount(selectedTrack.milestones)} /{' '}
                  {selectedTrack.milestones.length}
                </strong>
                <p>{nextMilestone?.title ?? 'No upcoming milestone'}</p>
              </article>
            </section>

            <section className="two-column">
              <article className="panel">
                <div className="section-heading">
                  <h3>Top risk flags</h3>
                  <span>{topRiskFlags.length} shown</span>
                </div>
                <div className="item-list">
                  {topRiskFlags.map((risk) => (
                    <article className="list-row" key={risk.id}>
                      <div>
                        <strong>{risk.title}</strong>
                        <p>{risk.detail}</p>
                      </div>
                      <Badge label={risk.level} tone={riskTone[risk.level]} />
                    </article>
                  ))}
                </div>
              </article>

              <article className="panel">
                <div className="section-heading">
                  <h3>Next priority actions</h3>
                  <span>{priorityActions.length} active</span>
                </div>
                <div className="item-list">
                  {priorityActions.map((action) => (
                    <article className="list-row" key={action.id}>
                      <div>
                        <strong>{action.title}</strong>
                        <p>
                          {action.ownerLabel} - {action.dueLabel}
                        </p>
                      </div>
                      <Badge
                        label={action.priority}
                        tone={priorityTone[action.priority]}
                      />
                    </article>
                  ))}
                </div>
              </article>
            </section>

            <section className="panel">
              <div className="section-heading">
                <h3>Readiness categories</h3>
                <span>Demo scoring notes</span>
              </div>
              <div className="category-grid">
                {selectedTrack.readinessCategories.map((category) => (
                  <article className="category-card" key={category.id}>
                    <strong>{category.label}</strong>
                    <span>{category.score}%</span>
                    <p>{category.note}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeScreen === 'tracks' && (
          <section className="card-grid">
            {trackCards.map((track) => (
              <article className="track-card" key={track.id}>
                <div className="card-header">
                  <Badge label={track.status} tone={trackTone[track.status]} />
                  <strong>{track.calculatedReadinessScore}%</strong>
                </div>
                <h3>{track.title}</h3>
                <p>{track.targetRole}</p>
                <dl className="track-facts">
                  <div>
                    <dt>Domain</dt>
                    <dd>{track.domain}</dd>
                  </div>
                  <div>
                    <dt>Market</dt>
                    <dd>{track.market}</dd>
                  </div>
                  <div>
                    <dt>Top risk</dt>
                    <dd>{track.topRiskFlag?.title ?? 'None'}</dd>
                  </div>
                </dl>
                <div className="progress-bar" aria-hidden="true">
                  <span style={{ width: `${track.calculatedReadinessScore}%` }} />
                </div>
              </article>
            ))}
          </section>
        )}

        {activeScreen === 'training' && (
          <section className="panel">
            <div className="section-heading">
              <h3>Training tracker</h3>
              <span>{selectedTrack.title}</span>
            </div>
            <div className="data-table">
              {selectedTrack.trainingPlan.map((item) => (
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
              {selectedTrack.documentChecklist.map((item) => (
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

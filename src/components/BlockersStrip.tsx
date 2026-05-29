import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { getRecommendationSet } from '../utils/recommendations'

interface BlockersStripProps {
  selectedTrack: CareerTrack
}

export function BlockersStrip({ selectedTrack }: BlockersStripProps) {
  const { blockers } = getRecommendationSet(selectedTrack)

  if (blockers.length === 0) {
    return (
      <section className="blockers-strip blockers-strip--clear" aria-label="Blockers">
        <span className="blockers-strip-label">Blockers</span>
        <span className="blockers-strip-clear">No blocking items — track is clear to advance.</span>
      </section>
    )
  }

  return (
    <section className="blockers-strip" aria-label="Blockers">
      <div className="blockers-strip-header">
        <span className="blockers-strip-label">Blockers</span>
        <Badge label={`${blockers.length} gating`} tone="danger" />
      </div>
      <div className="blockers-list">
        {blockers.map((blocker) => (
          <article className="blocker-item" key={blocker.id}>
            <div className="blocker-item-header">
              <span className="blocker-item-title">{blocker.title}</span>
              <div className="badge-pair">
                <Badge label={blocker.priority} tone={blocker.priority === 'Critical' ? 'danger' : 'warning'} />
                <Badge label="Blocking" tone="danger" />
              </div>
            </div>
            <p className="blocker-item-desc">{blocker.description}</p>
            <p className="blocker-item-footer">
              Category: {blocker.category} — Verify with official source and recruiter. Requirements may change.
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

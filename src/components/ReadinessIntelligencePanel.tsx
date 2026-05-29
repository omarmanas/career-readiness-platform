import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { gapSeverityTone } from '../utils/display'
import { generateNextActions } from '../utils/actions'
import { getHighestRoiAction } from '../utils/gaps'
import { getFastestPathToPlus10, getTopBlockers } from '../utils/intelligence'

interface ReadinessIntelligencePanelProps {
  selectedTrack: CareerTrack
}

export function ReadinessIntelligencePanel({
  selectedTrack,
}: ReadinessIntelligencePanelProps) {
  const blockers = getTopBlockers(selectedTrack)
  const roiAction = getHighestRoiAction(selectedTrack)
  const fastestPath = getFastestPathToPlus10(selectedTrack)
  const criticalActions = generateNextActions(selectedTrack).filter(
    (a) => a.priority === 'Critical' && a.status !== 'Completed' && a.status !== 'Deferred',
  )

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>Readiness Intelligence</h3>
        <Badge
          label={`${blockers.length} blocker${blockers.length !== 1 ? 's' : ''}`}
          tone={blockers.length > 0 ? 'danger' : 'success'}
        />
      </div>

      <div className="intel-sections">
        {/* Top blockers */}
        <div className="intel-section">
          <p className="intel-subheading">Top blockers</p>
          {blockers.length === 0 ? (
            <p className="intel-empty">No critical blockers detected.</p>
          ) : (
            <div className="intel-list">
              {blockers.map((blocker) => (
                <div className="intel-item" key={blocker.id}>
                  <div className="intel-item-header">
                    <span>{blocker.title}</span>
                    <Badge
                      label={blocker.severity}
                      tone={gapSeverityTone[blocker.severity]}
                    />
                  </div>
                  <small>{blocker.reason}</small>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fastest path to +10% */}
        <div className="intel-section">
          <p className="intel-subheading">Fastest path to +10%</p>
          {fastestPath.length === 0 ? (
            <p className="intel-empty">Track is near full readiness.</p>
          ) : (
            <div className="intel-list">
              {fastestPath.slice(0, 4).map((item) => (
                <div className="intel-item intel-item--path" key={item.title}>
                  <div className="intel-item-header">
                    <span>{item.title}</span>
                    <span className="intel-pts">+{item.estimatedPoints} pt{item.estimatedPoints !== 1 ? 's' : ''}</span>
                  </div>
                  <small>{item.category}</small>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Highest ROI action */}
        <div className="intel-section">
          <p className="intel-subheading">Highest ROI action</p>
          {roiAction ? (
            <div className="intel-item">
              <div className="intel-item-header">
                <span>{roiAction.gap.recommendedAction.title}</span>
                <Badge label={roiAction.gap.severity} tone={gapSeverityTone[roiAction.gap.severity]} />
              </div>
              <small>{roiAction.gap.recommendedAction.whyItMatters}</small>
            </div>
          ) : (
            <p className="intel-empty">All actionable gaps resolved or deferred.</p>
          )}
        </div>

        {/* Critical recruiter actions */}
        {criticalActions.length > 0 && (
          <div className="intel-section">
            <p className="intel-subheading">Critical recruiter actions</p>
            <div className="intel-list">
              {criticalActions.slice(0, 3).map((action) => (
                <div className="intel-item" key={action.id}>
                  <div className="intel-item-header">
                    <span>{action.title}</span>
                    <span className="intel-due">{action.dueWindow}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

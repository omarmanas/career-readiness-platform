import { getText, type Language } from '../i18n'
import type { CareerTrack } from '../types'
import { getRecommendationSet } from '../utils/recommendations'
import { calculateReadinessScore, getNextMilestone } from '../utils/readiness'

interface CoachBriefCardProps {
  selectedTrack: CareerTrack
  language: Language
}

function fill(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), template)
}

export function CoachBriefCard({ selectedTrack, language }: CoachBriefCardProps) {
  const score = calculateReadinessScore(selectedTrack)
  const { blockers, nextActions } = getRecommendationSet(selectedTrack, 5, language)
  const nextMilestone = getNextMilestone(selectedTrack.milestones)

  const primaryBlocker = blockers[0]
  const nextAction = nextActions[0]

  const readinessLine = fill(getText(language, 'coachReadinessLine'), { score: String(score) })

  const blockerLine = primaryBlocker
    ? fill(getText(language, 'coachBlockerLine'), { blocker: primaryBlocker.title })
    : getText(language, 'coachNoBlocker')

  let focusLine: string
  if (nextAction && nextMilestone) {
    focusLine = fill(getText(language, 'coachFocusLine'), { action: nextAction.title })
  } else if (nextAction) {
    focusLine = fill(getText(language, 'coachFocusActionOnly'), { action: nextAction.title })
  } else if (nextMilestone) {
    focusLine = getText(language, 'coachFocusMilestoneOnly')
  } else {
    focusLine = getText(language, 'coachNoAction')
  }

  return (
    <article className="coach-brief-card" aria-label={getText(language, 'coachBrief')}>
      <span className="coach-brief-kicker">{getText(language, 'coachBrief')}</span>
      <p className="coach-brief-line">{readinessLine}</p>
      <p className="coach-brief-line">{blockerLine}</p>
      <p className="coach-brief-line">{focusLine}</p>
    </article>
  )
}

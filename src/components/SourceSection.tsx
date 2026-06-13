import { getText, type Language } from '../i18n'
import type { GuidanceSource } from '../types'

interface SourceSectionProps {
  source: GuidanceSource | null | undefined
  language: Language
  variant?: 'detail' | 'inline'
}

const CONFIDENCE_LEVEL_KEYS: Record<string, string> = {
  official: 'confidenceOfficial',
  informed: 'confidenceInformed',
  estimated: 'confidenceEstimated',
}

export function SourceSection({ source, language, variant = 'detail' }: SourceSectionProps) {
  return (
    <section className="detail-section">
      <h5>{getText(language, 'source')}</h5>
      {source ? (
        <div className={`source-attribution source-attribution--${variant}`}>
          <div>
            <span>{getText(language, 'sourceType')}</span>
            <strong>{source.sourceType}</strong>
          </div>
          <div>
            <span>{getText(language, 'sourceName')}</span>
            <strong>{source.sourceName}</strong>
          </div>
          <div>
            <span>{getText(language, 'sourceUrl')}</span>
            {source.sourceUrl ? (
              <a href={source.sourceUrl} target="_blank" rel="noreferrer">
                {getText(language, 'verifySource')}
              </a>
            ) : (
              <strong>{getText(language, 'notSpecified')}</strong>
            )}
          </div>
          <div>
            <span>{getText(language, 'lastReviewed')}</span>
            <strong>{source.lastReviewed ?? getText(language, 'notReviewed')}</strong>
          </div>
          {source.rationale && (
            <div>
              <span>{getText(language, 'rationale')}</span>
              <strong>{source.rationale}</strong>
            </div>
          )}
          {source.confidenceLevel && (
            <div>
              <span>{getText(language, 'confidenceLevel')}</span>
              <strong>
                {getText(
                  language,
                  CONFIDENCE_LEVEL_KEYS[source.confidenceLevel] ?? source.confidenceLevel,
                )}
              </strong>
            </div>
          )}
        </div>
      ) : (
        <p className="detail-muted-note">{getText(language, 'noSourceMetadata')}</p>
      )}
    </section>
  )
}

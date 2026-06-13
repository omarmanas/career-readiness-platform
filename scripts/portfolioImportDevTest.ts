import type { PortfolioImportReport } from './portfolioImport'
import { loadPortfolioJson } from './portfolioImport'

const EXAMPLE_PORTFOLIO_URL = '/examples/portfolio.example.json'

export async function runPortfolioImportDevTest(): Promise<PortfolioImportReport> {
  const response = await fetch(EXAMPLE_PORTFOLIO_URL)

  if (!response.ok) {
    return {
      valid: false,
      errors: [
        `Unable to load ${EXAMPLE_PORTFOLIO_URL}: ${response.status} ${response.statusText}`,
      ],
      warnings: [],
      stats: {
        requirements: 0,
        documents: 0,
        trainings: 0,
        milestones: 0,
      },
    }
  }

  const raw = (await response.json()) as unknown
  return loadPortfolioJson(raw).report
}

import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const repoRoot = resolve(import.meta.dirname, '..')
const outDir = mkdtempSync(join(tmpdir(), 'portfolio-import-validation-'))
const tscBin = join(
  repoRoot,
  'node_modules',
  'typescript',
  'bin',
  'tsc',
)

try {
  execFileSync(
    process.execPath,
    [
      tscBin,
      'src/utils/portfolioImport.ts',
      'src/utils/portfolioJson.ts',
      'src/types/portfolioJson.ts',
      '--ignoreConfig',
      '--target',
      'ES2022',
      '--module',
      'commonjs',
      '--moduleResolution',
      'node',
      '--ignoreDeprecations',
      '6.0',
      '--outDir',
      outDir,
      '--skipLibCheck',
    ],
    {
      cwd: repoRoot,
      stdio: 'pipe',
    },
  )

  const { loadPortfolioJson } = await import(
    pathToFileURL(join(outDir, 'utils', 'portfolioImport.js')).href
  )
  const raw = readFileSync(
    join(repoRoot, 'public', 'examples', 'portfolio.example.json'),
    'utf8',
  )
  const { report } = loadPortfolioJson(raw)

  console.log(`valid: ${report.valid}`)
  console.log(`schemaVersion: ${report.schemaVersion ?? 'unknown'}`)
  console.log(`errors: ${JSON.stringify(report.errors, null, 2)}`)
  console.log(`warnings: ${JSON.stringify(report.warnings, null, 2)}`)
  console.log(`stats: ${JSON.stringify(report.stats, null, 2)}`)

  if (!report.valid) {
    process.exitCode = 1
  }
} finally {
  rmSync(outDir, { recursive: true, force: true })
}

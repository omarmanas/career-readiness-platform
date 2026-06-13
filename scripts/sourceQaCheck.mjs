import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const repoRoot = resolve(import.meta.dirname, '..')

const filesToScan = [
  'src/data/sampleData.ts',
  'public/examples/portfolio.example.json',
]

const warnings = []

function warn(file, line, category, message) {
  warnings.push({ file, line, category, message })
}

function isOfficialType(value) {
  return ['Official', 'official', 'official_regulatory', 'regulatory'].includes(
    value,
  )
}

function isHighConfidence(value) {
  return ['High', 'high', 'official'].includes(value)
}

function isEstimatedType(value) {
  return ['estimated'].includes(value)
}

function isUserOrInternal(value) {
  return ['User Provided', 'Internal'].includes(value)
}

function isPlaceholderUrl(value = '') {
  return /https?:\/\/(www\.)?example\.(gov|edu|com)\b/i.test(value)
}

function isHomepageLikeUrl(value = '') {
  try {
    const url = new URL(value)
    const path = url.pathname.replace(/\/+$/, '')
    return path === '' || path === '/'
  } catch {
    return false
  }
}

function getLineForIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length
}

function extractValue(block, key) {
  const quoted = new RegExp(`${key}\\s*:\\s*['"]([^'"]+)['"]`).exec(block)
  if (quoted) return quoted[1]
  const expression = new RegExp(`${key}\\s*:\\s*([^,\\n}]+)`).exec(block)
  if (expression) return expression[1].trim()
  return undefined
}

function scanRecord(file, text, block, offset) {
  const sourceName = extractValue(block, 'sourceName')
  const sourceUrl = extractValue(block, 'sourceUrl')
  const sourceType = extractValue(block, 'sourceType')
  const confidenceLevel = extractValue(block, 'confidenceLevel')
  const line = getLineForIndex(text, offset)

  if (isOfficialType(sourceType) && !sourceUrl) {
    warn(
      file,
      line,
      'official-missing-url',
      `${sourceName ?? 'Unnamed source'} is marked ${sourceType} without sourceUrl.`,
    )
  }

  if (isOfficialType(sourceType) && isPlaceholderUrl(sourceUrl)) {
    warn(
      file,
      line,
      'official-placeholder-url',
      `${sourceName ?? 'Unnamed source'} is marked ${sourceType} with placeholder URL ${sourceUrl}.`,
    )
  }

  if (isOfficialType(sourceType) && isHomepageLikeUrl(sourceUrl)) {
    warn(
      file,
      line,
      'official-homepage-url',
      `${sourceName ?? 'Unnamed source'} is marked ${sourceType} with homepage-like URL ${sourceUrl}.`,
    )
  }

  if (isHighConfidence(confidenceLevel) && !sourceUrl) {
    warn(
      file,
      line,
      'high-confidence-missing-url',
      `${sourceName ?? 'Unnamed source'} has ${confidenceLevel} confidence without sourceUrl.`,
    )
  }

  if (isEstimatedType(sourceType) && isHighConfidence(confidenceLevel)) {
    warn(
      file,
      line,
      'estimated-high-confidence',
      `${sourceName ?? 'Unnamed source'} is estimated but has ${confidenceLevel} confidence.`,
    )
  }

  if (isUserOrInternal(sourceType) && isHighConfidence(confidenceLevel)) {
    warn(
      file,
      line,
      'user-internal-high-confidence',
      `${sourceName ?? 'Unnamed source'} is ${sourceType} but has ${confidenceLevel} confidence.`,
    )
  }

  if (
    sourceName &&
    /official/i.test(sourceName) &&
    !isOfficialType(sourceType) &&
    !isHighConfidence(confidenceLevel)
  ) {
    warn(
      file,
      line,
      'official-name-nonofficial-metadata',
      `${sourceName} contains "official" but metadata is ${sourceType ?? 'unspecified'} / ${confidenceLevel ?? 'unspecified'}.`,
    )
  }

  if (sourceUrl && !sourceName) {
    warn(
      file,
      line,
      'url-without-name',
      `sourceUrl ${sourceUrl} is present without sourceName.`,
    )
  }

  if (sourceName && !sourceUrl) {
    warn(
      file,
      line,
      'name-without-url',
      `${sourceName} has sourceName but no sourceUrl.`,
    )
  }
}

function scanTextFile(relativePath) {
  const text = readFileSync(join(repoRoot, relativePath), 'utf8')
  const sourceKeyPattern = /sourceName\s*:/g
  let match

  while ((match = sourceKeyPattern.exec(text)) !== null) {
    const objectStart = text.lastIndexOf('{', match.index)
    const objectEnd = text.indexOf('}', match.index)
    if (objectStart === -1 || objectEnd === -1) continue
    scanRecord(relativePath, text, text.slice(objectStart, objectEnd + 1), objectStart)
  }
}

function walkJson(value, visitor, path = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkJson(item, visitor, [...path, index]))
    return
  }
  if (!value || typeof value !== 'object') return
  visitor(value, path)
  Object.entries(value).forEach(([key, child]) => walkJson(child, visitor, [...path, key]))
}

function scanJsonFile(relativePath) {
  const text = readFileSync(join(repoRoot, relativePath), 'utf8')
  const data = JSON.parse(text)
  walkJson(data, (record, path) => {
    if (
      'sourceName' in record ||
      'sourceUrl' in record ||
      'sourceType' in record ||
      'confidenceLevel' in record
    ) {
      const sourceName = record.sourceName
      const firstKey = sourceName ? `"sourceName": "${sourceName}"` : '"sourceUrl"'
      const offset = text.indexOf(firstKey)
      const block = JSON.stringify(record)
      scanRecord(
        `${relativePath}#/${path.join('/')}`,
        text,
        block,
        offset === -1 ? 0 : offset,
      )
    }
  })
}

for (const file of filesToScan) {
  if (file.endsWith('.json')) scanJsonFile(file)
  else scanTextFile(file)
}

console.log('Source QA check')
console.log(`Files scanned: ${filesToScan.length}`)

if (warnings.length > 0) {
  for (const warning of warnings) {
    console.log(
      `[WARN] ${warning.category} ${warning.file}:${warning.line} - ${warning.message}`,
    )
  }
}

const categoryCounts = warnings.reduce((counts, warning) => {
  counts[warning.category] = (counts[warning.category] ?? 0) + 1
  return counts
}, {})

console.log(`Warnings: ${warnings.length}`)
console.log(`Categories: ${JSON.stringify(categoryCounts, null, 2)}`)
console.log('Exit code: 0 (warnings are non-blocking)')

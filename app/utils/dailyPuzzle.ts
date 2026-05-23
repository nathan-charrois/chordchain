export type DailyPuzzle = {
  date: string
  target: string[]
  key?: string
  mode?: string
}

const DAILY_PUZZLE_CATALOG: Record<string, DailyPuzzle> = {
  '2026-05-19': { date: '2026-05-19', target: ['C', 'Am', 'F', 'G'], key: 'C', mode: 'Ionian' },
  '2026-05-20': { date: '2026-05-20', target: ['Em', 'Am', 'F', 'G'], key: 'C', mode: 'Ionian' },
  '2026-05-21': { date: '2026-05-21', target: ['Dm', 'G', 'C', 'Am'], key: 'C', mode: 'Ionian' },
  '2026-05-22': { date: '2026-05-22', target: ['Am', 'F', 'C', 'G'], key: 'C', mode: 'Ionian' },
  '2026-05-23': { date: '2026-05-23', target: ['F', 'G', 'Em', 'Am'], key: 'C', mode: 'Ionian' },
}

export function getCatalogDatesDesc(maxDate?: string): string[] {
  return Object.keys(DAILY_PUZZLE_CATALOG)
    .filter(date => (maxDate ? date <= maxDate : true))
    .sort((left, right) => right.localeCompare(left))
}

export function resolveDailyPuzzle(date: string): DailyPuzzle {
  const directMatch = DAILY_PUZZLE_CATALOG[date]

  if (directMatch) {
    return directMatch
  }

  const sortedDates = Object.keys(DAILY_PUZZLE_CATALOG).sort((left, right) => left.localeCompare(right))
  const nearestPrior = [...sortedDates].reverse().find(value => value <= date)

  // Deterministic fallback rule:
  // 1) Use nearest prior catalog date.
  // 2) If no prior date exists, use earliest catalog entry.
  const fallbackDate = nearestPrior ?? sortedDates[0]

  return DAILY_PUZZLE_CATALOG[fallbackDate]
}

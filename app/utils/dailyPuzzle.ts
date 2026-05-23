export type DailyPuzzle = {
  date: string
  target: string[]
  key?: string
  mode?: string
}

const DAILY_PUZZLE_CATALOG: Record<string, DailyPuzzle> = {
  '2026-05-23': { date: '2026-05-23', target: ['F', 'G', 'Em', 'Am'], key: 'C', mode: 'Ionian' },
  '2026-05-24': { date: '2026-05-24', target: ['C', 'Am', 'F', 'G'], key: 'C', mode: 'Ionian' },
  '2026-05-25': { date: '2026-05-25', target: ['Em', 'Am', 'F', 'G'], key: 'C', mode: 'Ionian' },
  '2026-05-26': { date: '2026-05-26', target: ['Dm', 'G', 'C', 'Am'], key: 'C', mode: 'Ionian' },
  '2026-05-27': { date: '2026-05-27', target: ['C', 'Am', 'F', 'G'], key: 'C', mode: 'Ionian' },
  '2026-05-28': { date: '2026-05-28', target: ['Em', 'Am', 'F', 'G'], key: 'C', mode: 'Ionian' },
  '2026-05-29': { date: '2026-05-29', target: ['Dm', 'G', 'C', 'Am'], key: 'C', mode: 'Ionian' },
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

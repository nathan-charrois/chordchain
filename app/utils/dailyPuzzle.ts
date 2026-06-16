import type { ModeId, PaletteSectionId } from './music'
import { formatModeLabel, normalizeKey, normalizeModeId } from './music'

export type DailyPuzzleDifficulty = 'Easy' | 'Medium' | 'Hard'

export type DailyPuzzle = {
  date: string
  name: string
  target: string[]
  key: string
  mode: ModeId
  difficulty: DailyPuzzleDifficulty
}

type DailyPuzzleCatalogEntry = {
  date: string
  name: string
  target: string[]
  key?: string
  mode?: string
  difficulty?: string
}

const DAILY_PUZZLE_CATALOG: Record<string, DailyPuzzleCatalogEntry> = {
  '2026-05-23': { date: '2026-05-23', name: 'Open Roads', target: ['Dm', 'Gmaj', 'Am7', 'Dm'], key: 'D', mode: 'Dorian', difficulty: 'Hard' },
  '2026-05-24': { date: '2026-05-24', name: 'Velvet Echo', target: ['Em', 'Fmaj', 'G7', 'Em'], key: 'E', mode: 'Phrygian', difficulty: 'Medium' },
  '2026-05-25': { date: '2026-05-25', name: 'Warm Sunrise', target: ['Cmaj', 'Fmaj', 'G7', 'Cmaj'], key: 'C', mode: 'Ionian', difficulty: 'Medium' },
  '2026-05-26': { date: '2026-05-26', name: 'Sky Lantern', target: ['Fmaj', 'Gmaj', 'Cmaj7', 'Fmaj'], key: 'F', mode: 'Lydian', difficulty: 'Hard' },
  '2026-05-27': { date: '2026-05-27', name: 'Neon Drift', target: ['G7', 'Fmaj', 'Cmaj', 'Gmaj'], key: 'G', mode: 'Mixolydian', difficulty: 'Medium' },
  '2026-05-28': { date: '2026-05-28', name: 'Quiet Harbor', target: ['Am', 'Dm', 'Em7', 'Am'], key: 'A', mode: 'Aeolian', difficulty: 'Hard' },
  '2026-05-29': { date: '2026-05-29', name: 'Paper Moon', target: ['Cmaj', 'Dm', 'Em7', 'Cmaj'], key: 'B', mode: 'Locrian', difficulty: 'Hard' },
  '2026-05-30': { date: '2026-05-30', name: 'Citrus Light', target: ['Am', 'Fmaj', 'G7', 'Cmaj'], key: 'C', mode: 'Ionian', difficulty: 'Medium' },
  '2026-05-31': { date: '2026-05-31', name: 'After Rain', target: ['Dm', 'Em7', 'Cmaj', 'Dm'], key: 'D', mode: 'Dorian', difficulty: 'Hard' },
  '2026-06-01': { date: '2026-06-01', name: 'Amber Hall', target: ['Em', 'Am7', 'Fmaj', 'Em'], key: 'E', mode: 'Phrygian', difficulty: 'Hard' },
  '2026-06-02': { date: '2026-06-02', name: 'Kite Parade', target: ['Fmaj', 'Em7', 'Gmaj', 'Fmaj'], key: 'F', mode: 'Lydian', difficulty: 'Hard' },
  '2026-06-03': { date: '2026-06-03', name: 'Rolling Tide', target: ['Gmaj', 'Dm7', 'Fmaj', 'Gmaj'], key: 'G', mode: 'Mixolydian', difficulty: 'Hard' },
  '2026-06-04': { date: '2026-06-04', name: 'Moss Path', target: ['Am', 'Fmaj', 'G7', 'Am'], key: 'A', mode: 'Aeolian', difficulty: 'Medium' },
  '2026-06-05': { date: '2026-06-05', name: 'Clockwork Air', target: ['Dm', 'Em', 'Bm7b5', 'Cmaj'], key: 'B', mode: 'Locrian', difficulty: 'Hard' },
  '2026-06-06': { date: '2026-06-06', name: 'Golden Thread', target: ['Cmaj', 'Am', 'Dm', 'G7'], key: 'C', mode: 'Ionian', difficulty: 'Medium' },
  '2026-06-07': { date: '2026-06-07', name: 'Night Trains', target: ['Dm', 'Am', 'Cmaj7', 'Dm'], key: 'D', mode: 'Dorian', difficulty: 'Hard' },
  '2026-06-08': { date: '2026-06-08', name: 'Brick Lane Glow', target: ['Em', 'Dm7', 'Cmaj', 'Em'], key: 'E', mode: 'Phrygian', difficulty: 'Hard' },
  '2026-06-09': { date: '2026-06-09', name: 'Blue Terrace', target: ['Fmaj7', 'Am', 'Gmaj', 'Fmaj'], key: 'F', mode: 'Lydian', difficulty: 'Hard' },
  '2026-06-10': { date: '2026-06-10', name: 'Late Checkout', target: ['G7', 'Em', 'Dm', 'Gmaj'], key: 'G', mode: 'Mixolydian', difficulty: 'Medium' },
  '2026-06-11': { date: '2026-06-11', name: 'Faded Postcard', target: ['Am7', 'Cmaj', 'Gmaj', 'Am'], key: 'A', mode: 'Aeolian', difficulty: 'Hard' },
  '2026-06-12': { date: '2026-06-12', name: 'Silver Arcade', target: ['Cmaj', 'Gmaj', 'Am7', 'Dm'], key: 'B', mode: 'Locrian', difficulty: 'Hard' },
  '2026-06-13': { date: '2026-06-13', name: 'Signal Bloom', target: ['Cmaj', 'D7', 'Gmaj', 'Cmaj'], key: 'C', mode: 'Ionian', difficulty: 'Medium' },
  '2026-06-14': { date: '2026-06-14', name: 'City Lullaby', target: ['Dm', 'A7', 'Dm', 'Gmaj'], key: 'D', mode: 'Dorian', difficulty: 'Medium' },
  '2026-06-15': { date: '2026-06-15', name: 'Low Horizon', target: ['Em', 'B7', 'Em', 'Fmaj'], key: 'E', mode: 'Phrygian', difficulty: 'Medium' },
  '2026-06-16': { date: '2026-06-16', name: 'Glass Garden', target: ['Fmaj', 'C7', 'Fmaj', 'Gmaj'], key: 'F', mode: 'Lydian', difficulty: 'Medium' },
  '2026-06-17': { date: '2026-06-17', name: 'Old Radio', target: ['Gmaj', 'D7', 'Gmaj', 'Fmaj'], key: 'G', mode: 'Mixolydian', difficulty: 'Medium' },
  '2026-06-18': { date: '2026-06-18', name: 'Slow Comet', target: ['Am', 'E7', 'Am', 'Dm'], key: 'A', mode: 'Aeolian', difficulty: 'Medium' },
  '2026-06-19': { date: '2026-06-19', name: 'Lantern Steps', target: ['Bdim', 'Em7', 'Fmaj', 'Cmaj'], key: 'B', mode: 'Locrian', difficulty: 'Hard' },
}

type PuzzleSlugEntry = {
  date: string
}

let puzzleSlugEntries: Record<string, PuzzleSlugEntry> | null = null

export function normalizeDifficulty(difficulty: string | undefined): DailyPuzzleDifficulty {
  if (difficulty === 'Easy' || difficulty === 'Medium' || difficulty === 'Hard') {
    return difficulty
  }

  return 'Medium'
}

export function getEnabledPaletteSectionIds(difficulty: DailyPuzzleDifficulty): PaletteSectionId[] {
  switch (difficulty) {
    case 'Easy':
      return ['diatonic']
    case 'Medium':
      return ['diatonic', 'secondaryDominant']
    case 'Hard':
      return ['diatonic', 'secondaryDominant', 'extensions']
  }
}

function slugifyPuzzleName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getPuzzleSlug(puzzle: Pick<DailyPuzzle, 'date' | 'name'>): string {
  return slugifyPuzzleName(puzzle.name) || `puzzle-${puzzle.date}`
}

export function encodePuzzleSlug(slug: string): string {
  return encodeURIComponent(slug)
}

export function decodePuzzleSlug(value: string | undefined): string | null {
  if (!value) {
    return null
  }

  try {
    const decoded = decodeURIComponent(value).trim()

    if (!decoded) {
      return null
    }

    return decoded
  }
  catch {
    return null
  }
}

function getPuzzleSlugEntries(): Record<string, PuzzleSlugEntry> {
  if (puzzleSlugEntries) {
    return puzzleSlugEntries
  }

  const slugEntries: Record<string, PuzzleSlugEntry> = {}

  for (const date of Object.keys(DAILY_PUZZLE_CATALOG).sort((left, right) => left.localeCompare(right))) {
    const entry = DAILY_PUZZLE_CATALOG[date]
    const slug = getPuzzleSlug(entry)

    if (slugEntries[slug]) {
      console.warn(
        `[dailyPuzzle] Duplicate puzzle slug '${slug}' for '${slugEntries[slug].date}' and '${date}'. `
        + `Keeping '${slugEntries[slug].date}'.`,
      )
      continue
    }

    slugEntries[slug] = {
      date,
    }
  }

  puzzleSlugEntries = slugEntries

  return slugEntries
}

function resolvePuzzleEntry(entry: DailyPuzzleCatalogEntry): DailyPuzzle {
  const key = normalizeKey(entry.key)
  const mode = normalizeModeId(entry.mode)
  const difficulty = normalizeDifficulty(entry.difficulty)

  return {
    ...entry,
    key,
    mode,
    difficulty,
  }
}

export function getPuzzleScaleLabel(puzzle: DailyPuzzle): string {
  return `${puzzle.key} ${formatModeLabel(puzzle.mode)}`
}

export function getCatalogDatesDesc(maxDate?: string): string[] {
  return Object.keys(DAILY_PUZZLE_CATALOG)
    .filter(date => (maxDate ? date <= maxDate : true))
    .sort((left, right) => right.localeCompare(left))
}

export function resolveDailyPuzzleBySlug(slug: string): DailyPuzzle | null {
  const slugEntry = getPuzzleSlugEntries()[slug]

  if (!slugEntry) {
    return null
  }

  return resolveDailyPuzzle(slugEntry.date)
}

export function resolvePuzzleDateFromSlug(routePuzzleSlug: string | undefined, fallbackDate: string): string {
  const slug = decodePuzzleSlug(routePuzzleSlug)

  if (!slug) {
    return fallbackDate
  }

  return resolveDailyPuzzleBySlug(slug)?.date ?? fallbackDate
}

export function getPuzzleSlugForDate(date: string): string {
  const puzzle = resolveDailyPuzzle(date)

  return getPuzzleSlug(puzzle)
}

export function getPuzzlePathForDate(date: string): string {
  return `/${encodePuzzleSlug(getPuzzleSlugForDate(date))}`
}

export function resolveDailyPuzzle(date: string): DailyPuzzle {
  const directMatch = DAILY_PUZZLE_CATALOG[date]

  if (directMatch) {
    return resolvePuzzleEntry(directMatch)
  }

  const sortedDates = Object.keys(DAILY_PUZZLE_CATALOG).sort((left, right) => left.localeCompare(right))
  const nearestPrior = [...sortedDates].reverse().find(value => value <= date)

  // Deterministic fallback rule:
  // 1) Use nearest prior catalog date.
  // 2) If no prior date exists, use earliest catalog entry.
  const fallbackDate = nearestPrior ?? sortedDates[0]

  return resolvePuzzleEntry(DAILY_PUZZLE_CATALOG[fallbackDate])
}

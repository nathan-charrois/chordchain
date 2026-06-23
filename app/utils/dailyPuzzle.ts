import { GAME_MAX_CHARS } from '~/constant'
import type { DrumLoopId } from '~/utils/drums'
import type { ArpeggiateType, ChordId, ModeId, PuzzleDifficulty } from '~/utils/music'
import {
  formatModeLabel,
  isChordAllowedForDifficulty,
  isChordId,
  normalizeKey,
  normalizeModeId,
} from '~/utils/music'

export type DailyPuzzle = {
  date: string
  name: string
  key: string
  mode: ModeId
  arpeggiateType: ArpeggiateType
  drumLoopId: DrumLoopId
  difficulty: PuzzleDifficulty
  progression: ChordId[]
}

const DAILY_PUZZLE_CATALOG: Record<string, DailyPuzzle> = {
  '2026-07-12': {
    date: '2026-07-12',
    name: 'Boxed Upside',
    key: 'B',
    mode: 'locrian',
    difficulty: 'hard',
    arpeggiateType: 'broken_chord',
    drumLoopId: 'velvetBasement',
    progression: [
      { degree: 4, type: 'seventh' },
      { degree: 2, type: 'triad' },
      { degree: 3, type: 'seventh' },
      { degree: 5, type: 'seventh' },
    ],
  },
  '2026-07-11': {
    date: '2026-07-11',
    name: 'Velvet Echo',
    key: 'E',
    mode: 'phrygian',
    difficulty: 'medium',
    arpeggiateType: 'triad_ascend',
    drumLoopId: 'velvetBasement',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 2, type: 'triad' },
      { degree: 3, type: 'seventh' },
      { degree: 1, type: 'triad' },
    ],
  },
  '2026-07-10': {
    date: '2026-07-10',
    name: 'Warm Sunrise',
    key: 'C',
    mode: 'ionian',
    difficulty: 'easy',
    arpeggiateType: 'seventh_pop_ostinato',
    drumLoopId: 'sunriseTerrace',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 4, type: 'triad' },
      { degree: 5, type: 'triad' },
      { degree: 1, type: 'triad' },
    ],
  },
  '2026-07-09': {
    date: '2026-07-09',
    name: 'Sky Lantern',
    key: 'F',
    mode: 'lydian',
    difficulty: 'medium',
    arpeggiateType: 'cascade_up',
    drumLoopId: 'deepHousePulse',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 2, type: 'triad' },
      { degree: 5, type: 'seventh' },
      { degree: 1, type: 'triad' },
    ],
  },
  '2026-07-08': {
    date: '2026-07-08',
    name: 'Quiet Harbor',
    key: 'A',
    mode: 'aeolian',
    difficulty: 'hard',
    arpeggiateType: 'triad_descend',
    drumLoopId: 'dubSpace',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 4, type: 'triad' },
      { degree: 5, type: 'seventh' },
      { degree: 1, type: 'triad' },
    ],
  },
  '2026-07-07': {
    date: '2026-07-07',
    name: 'Citrus Light',
    key: 'C',
    mode: 'ionian',
    difficulty: 'medium',
    arpeggiateType: 'spiral_down',
    drumLoopId: 'sunriseTerrace',
    progression: [
      { degree: 6, type: 'triad' },
      { degree: 4, type: 'triad' },
      { degree: 5, type: 'seventh' },
      { degree: 1, type: 'triad' },
    ],
  },
  '2026-07-06': {
    date: '2026-07-06',
    name: 'After Rain',
    key: 'D',
    mode: 'dorian',
    difficulty: 'hard',
    arpeggiateType: 'full_sweep',
    drumLoopId: 'loFiPocket',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 2, type: 'triad' },
      { degree: 7, type: 'sixth' },
      { degree: 1, type: 'triad' },
    ],
  },
  '2026-07-05': {
    date: '2026-07-05',
    name: 'Amber Hall',
    key: 'D',
    mode: 'aeolian',
    difficulty: 'hard',
    arpeggiateType: 'triad_updown',
    drumLoopId: 'dustyBreak',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 4, type: 'triad' },
      { degree: 3, type: 'suspended' },
      { degree: 2, type: 'triad' },
    ],
  },
  '2026-07-04': {
    date: '2026-07-04',
    name: 'Rolling Tide',
    key: 'G',
    mode: 'aeolian',
    difficulty: 'medium',
    arpeggiateType: 'triad_ascend',
    drumLoopId: 'polymeterPanic',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 5, type: 'seventh' },
      { degree: 7, type: 'triad' },
      { degree: 1, type: 'triad' },
    ],
  },
  '2026-07-03': {
    date: '2026-07-03',
    name: 'Moss Path',
    key: 'A',
    mode: 'aeolian',
    difficulty: 'medium',
    arpeggiateType: 'triad_ascend',
    drumLoopId: 'halfTimeHeadNod',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 6, type: 'triad' },
      { degree: 7, type: 'seventh' },
      { degree: 1, type: 'triad' },
    ],
  },
  '2026-07-02': {
    date: '2026-07-02',
    name: 'Clockwork Air',
    key: 'C',
    mode: 'dorian',
    difficulty: 'easy',
    arpeggiateType: 'deep_house_pulse',
    drumLoopId: 'boomBapBounce',
    progression: [
      { degree: 3, type: 'triad' },
      { degree: 4, type: 'triad' },
      { degree: 5, type: 'triad' },
      { degree: 2, type: 'triad' },
    ],
  },
  '2026-07-01': {
    date: '2026-07-01',
    name: 'Night Trains',
    key: 'D',
    mode: 'dorian',
    difficulty: 'hard',
    arpeggiateType: 'broken_chord',
    drumLoopId: 'velvetBasement',
    progression: [
      { degree: 1, type: 'seventh' },
      { degree: 5, type: 'triad' },
      { degree: 7, type: 'seventh' },
      { degree: 1, type: 'triad' },
    ],
  },
  '2026-06-30': {
    date: '2026-06-30',
    name: 'Blue Terrace',
    key: 'F',
    mode: 'lydian',
    difficulty: 'hard',
    arpeggiateType: 'seventh_double',
    drumLoopId: 'sunriseTerrace',
    progression: [
      { degree: 1, type: 'seventh' },
      { degree: 3, type: 'seventh' },
      { degree: 2, type: 'seventh' },
      { degree: 1, type: 'seventh' },
    ],
  },
  '2026-06-29': {
    date: '2026-06-29',
    name: 'Late Checkout',
    key: 'G',
    mode: 'mixolydian',
    difficulty: 'medium',
    arpeggiateType: 'spiral_down',
    drumLoopId: 'midnightDrive',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 6, type: 'triad' },
      { degree: 5, type: 'seventh' },
      { degree: 1, type: 'seventh' },
    ],
  },
  '2026-06-28': {
    date: '2026-06-28',
    name: 'Faded Postcard',
    key: 'A',
    mode: 'aeolian',
    difficulty: 'medium',
    arpeggiateType: 'seventh_rythmic_feel',
    drumLoopId: 'dustyBreak',
    progression: [
      { degree: 1, type: 'seventh' },
      { degree: 3, type: 'seventh' },
      { degree: 7, type: 'triad' },
      { degree: 1, type: 'seventh' },
    ],
  },
  '2026-06-27': {
    date: '2026-06-27',
    name: 'Silver Arcade',
    key: 'B',
    mode: 'ionian',
    difficulty: 'medium',
    arpeggiateType: 'skip_thirds_up',
    drumLoopId: 'dustyBreak',
    progression: [
      { degree: 2, type: 'triad' },
      { degree: 6, type: 'triad' },
      { degree: 7, type: 'seventh' },
      { degree: 3, type: 'triad' },
    ],
  },
  '2026-06-26': {
    date: '2026-06-26',
    name: 'Signal Bloom',
    key: 'C',
    mode: 'ionian',
    difficulty: 'medium',
    arpeggiateType: 'seventh_ascend',
    drumLoopId: 'halfTimeHeadNod',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 2, type: 'seventh' },
      { degree: 5, type: 'triad' },
      { degree: 1, type: 'triad' },
    ],
  },
  '2026-06-25': {
    date: '2026-06-25',
    name: 'City Lullaby',
    key: 'D',
    mode: 'aeolian',
    difficulty: 'easy',
    arpeggiateType: 'triad_updown',
    drumLoopId: 'loFiPocket',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 5, type: 'triad' },
      { degree: 1, type: 'triad' },
      { degree: 4, type: 'triad' },
    ],
  },
  '2026-06-24': {
    date: '2026-06-24',
    name: 'Low Horizon',
    key: 'E',
    mode: 'phrygian',
    difficulty: 'easy',
    arpeggiateType: 'triad_downup',
    drumLoopId: 'dubSpace',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 5, type: 'triad' },
      { degree: 1, type: 'triad' },
      { degree: 2, type: 'triad' },
    ],
  },
  '2026-06-21': {
    date: '2026-06-21',
    name: 'Old Radio',
    key: 'G',
    mode: 'mixolydian',
    difficulty: 'easy',
    arpeggiateType: 'triad_descend',
    drumLoopId: 'boomBapBounce',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 5, type: 'triad' },
      { degree: 1, type: 'triad' },
      { degree: 7, type: 'triad' },
    ],
  },
  '2026-06-22': {
    date: '2026-06-22',
    name: 'Slow Comet',
    key: 'F',
    mode: 'dorian',
    difficulty: 'hard',
    arpeggiateType: 'seventh_ascend',
    drumLoopId: 'halfTimeHeadNod',
    progression: [
      { degree: 1, type: 'triad' },
      { degree: 2, type: 'seventh' },
      { degree: 5, type: 'sixth' },
      { degree: 3, type: 'suspended' },
    ],
  },
}

type PuzzleSlugEntry = {
  date: string
}

let puzzleSlugEntries: Record<string, PuzzleSlugEntry> | null = null

export function normalizeDifficulty(difficulty: string | undefined): PuzzleDifficulty {
  const normalized = difficulty?.trim().toLowerCase()

  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized
  }

  if (difficulty) {
    console.warn(`[dailyPuzzle] Unknown difficulty '${difficulty}', falling back to 'medium'.`)
  }

  return 'medium'
}

function validateProgression(
  date: string,
  progression: ChordId[],
  difficulty: PuzzleDifficulty,
): ChordId[] {
  if (progression.length !== GAME_MAX_CHARS) {
    throw new Error(
      `[dailyPuzzle] Puzzle '${date}' must contain ${GAME_MAX_CHARS} progression chords; received ${progression.length}.`,
    )
  }

  return progression.map((chord, index) => {
    if (!isChordId(chord)) {
      throw new Error(
        `[dailyPuzzle] Puzzle '${date}' contains an invalid chord identity at progression index ${index}.`,
      )
    }

    if (!isChordAllowedForDifficulty(chord, difficulty)) {
      throw new Error(
        `[dailyPuzzle] Puzzle '${date}' uses '${chord.type}' at progression index ${index}, `
        + `which is not available for '${difficulty}' difficulty.`,
      )
    }

    return { ...chord }
  })
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

function resolvePuzzleEntry(entry: DailyPuzzle): DailyPuzzle {
  const key = normalizeKey(entry.key)
  const mode = normalizeModeId(entry.mode)
  const difficulty = normalizeDifficulty(entry.difficulty)

  return {
    date: entry.date,
    name: entry.name,
    arpeggiateType: entry.arpeggiateType,
    drumLoopId: entry.drumLoopId,
    key,
    mode,
    difficulty,
    progression: validateProgression(entry.date, entry.progression, difficulty),
  }
}

export function getPuzzleScaleLabel(puzzle: DailyPuzzle): string {
  return `${puzzle.key} ${formatModeLabel(puzzle.mode)}`
}

export function getPuzzleDatesDesc(maxDate?: string): string[] {
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

export function getPuzzleNumberLabel(puzzle: DailyPuzzle): string {
  const puzzleDates = getPuzzleDatesDesc()
  const puzzleNumber = puzzleDates.length - puzzleDates.indexOf(puzzle.date)

  if (puzzleNumber) {
    return `Puzzle #${puzzleNumber}`
  }

  return `Unknown Puzzle #`
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

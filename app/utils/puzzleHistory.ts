import { PUZZLE_HISTORY_STORAGE_KEY } from '~/constant'
import { formatLocalDate } from '~/utils/date'

export type PuzzleHistoryEntry = {
  completed: boolean
  completedAt?: string
  attemptsUsed?: number
  hintsUsed?: number
}

export type PuzzleHistoryStore = {
  version: 1
  entries: Record<string, PuzzleHistoryEntry>
}

export type StreakResult = {
  current: number
}

const EMPTY_STORE: PuzzleHistoryStore = {
  version: 1,
  entries: {},
}

function clampHintsUsed(value: number): number {
  return Math.max(0, Math.min(2, value))
}

function parseDateKey(date: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  // Use noon local time to avoid DST-related midnight shifts.
  const parsed = new Date(year, month - 1, day, 12, 0, 0, 0)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

function getPreviousDateKey(date: string): string | null {
  const parsed = parseDateKey(date)

  if (!parsed) {
    return null
  }

  parsed.setDate(parsed.getDate() - 1)

  return formatLocalDate(parsed)
}

function isValidEntry(value: unknown): value is PuzzleHistoryEntry {
  if (!value || typeof value !== 'object') {
    return false
  }

  const entry = value as Partial<PuzzleHistoryEntry>

  if (typeof entry.completed !== 'boolean') {
    return false
  }

  if (entry.completedAt !== undefined && typeof entry.completedAt !== 'string') {
    return false
  }

  if (entry.attemptsUsed !== undefined && typeof entry.attemptsUsed !== 'number') {
    return false
  }

  if (entry.hintsUsed !== undefined) {
    if (!Number.isInteger(entry.hintsUsed)) {
      return false
    }

    if (entry.hintsUsed < 0 || entry.hintsUsed > 2) {
      return false
    }
  }

  return true
}

function parsePuzzleHistoryStore(value: unknown): PuzzleHistoryStore | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const maybeStore = value as Partial<PuzzleHistoryStore>

  if (maybeStore.version !== 1 || typeof maybeStore.entries !== 'object' || !maybeStore.entries) {
    return null
  }

  const entries: Record<string, PuzzleHistoryEntry> = {}

  for (const [date, entry] of Object.entries(maybeStore.entries)) {
    if (isValidEntry(entry)) {
      entries[date] = entry
    }
  }

  return {
    version: 1,
    entries,
  }
}

export function readPuzzleHistory(): PuzzleHistoryStore {
  if (typeof window === 'undefined') {
    return EMPTY_STORE
  }

  try {
    const raw = localStorage.getItem(PUZZLE_HISTORY_STORAGE_KEY)

    if (!raw) {
      return EMPTY_STORE
    }

    const parsed: unknown = JSON.parse(raw)
    const store = parsePuzzleHistoryStore(parsed)

    if (!store) {
      writePuzzleHistory(EMPTY_STORE)
      return EMPTY_STORE
    }

    return store
  }
  catch {
    writePuzzleHistory(EMPTY_STORE)
    return EMPTY_STORE
  }
}

export function writePuzzleHistory(store: PuzzleHistoryStore): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(PUZZLE_HISTORY_STORAGE_KEY, JSON.stringify(store))
  }
  catch {
    // Ignore write failures to keep gameplay responsive.
  }
}

export function markPuzzleCompleted(
  store: PuzzleHistoryStore,
  date: string,
  attemptsUsed?: number,
): PuzzleHistoryStore {
  const currentEntry = store.entries[date]

  if (currentEntry?.completed) {
    return store
  }

  return {
    version: 1,
    entries: {
      ...store.entries,
      [date]: {
        completed: true,
        completedAt: new Date().toISOString(),
        attemptsUsed,
        hintsUsed: currentEntry?.hintsUsed,
      },
    },
  }
}

export function setPuzzleHintsUsed(
  store: PuzzleHistoryStore,
  date: string,
  hintsUsed: number,
): PuzzleHistoryStore {
  const normalizedHintsUsed = clampHintsUsed(hintsUsed)
  const currentEntry = store.entries[date]

  if (currentEntry?.hintsUsed === normalizedHintsUsed) {
    return store
  }

  return {
    version: 1,
    entries: {
      ...store.entries,
      [date]: {
        completed: currentEntry?.completed ?? false,
        completedAt: currentEntry?.completedAt,
        attemptsUsed: currentEntry?.attemptsUsed,
        hintsUsed: normalizedHintsUsed,
      },
    },
  }
}

export function revealPuzzleHint(store: PuzzleHistoryStore, date: string): PuzzleHistoryStore {
  const currentHintsUsed = store.entries[date]?.hintsUsed ?? 0
  const nextHintsUsed = clampHintsUsed(currentHintsUsed + 1)

  if (nextHintsUsed === currentHintsUsed) {
    return store
  }

  return setPuzzleHintsUsed(store, date, nextHintsUsed)
}

export function removePuzzleHistoryEntry(store: PuzzleHistoryStore, date: string): PuzzleHistoryStore {
  if (!(date in store.entries)) {
    return store
  }

  const entries = { ...store.entries }
  delete entries[date]

  return {
    version: 1,
    entries,
  }
}

export function calculateCurrentStreak(
  entries: Record<string, PuzzleHistoryEntry> | null | undefined,
  todayDate: string,
): StreakResult {
  if (!entries || typeof entries !== 'object') {
    return { current: 0 }
  }

  const todayEntry = entries[todayDate]

  if (!todayEntry?.completed) {
    return { current: 0 }
  }

  let current = 0
  let date = todayDate

  while (entries[date]?.completed) {
    current += 1

    const previousDate = getPreviousDateKey(date)

    if (!previousDate) {
      break
    }

    date = previousDate
  }

  return { current }
}

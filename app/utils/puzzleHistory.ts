import {
  GAME_MAX_CHARS,
  GAME_MAX_GUESSES,
  PUZZLE_HISTORY_STORAGE_KEY,
} from '~/constant'
import { resolveDailyPuzzle } from '~/utils/dailyPuzzle'
import { formatLocalDate } from '~/utils/date'
import type { ChordId, PuzzleDifficulty } from '~/utils/music'
import { areChordIdsEqual, isChordAllowedForDifficulty, isChordId } from '~/utils/music'

export type PuzzleHistoryGuess = {
  chords: ChordId[]
}

export type PuzzleHistoryEntry = {
  completed: boolean
  completedAt?: string
  failed?: boolean
  failedAt?: string
  attemptsUsed?: number
  guesses?: PuzzleHistoryGuess[]
}

export type PuzzleHistoryStore = {
  version: 2
  entries: Record<string, PuzzleHistoryEntry>
}

export type StreakResult = {
  current: number
}

const EMPTY_STORE: PuzzleHistoryStore = {
  version: 2,
  entries: {},
}

function clonePuzzleHistoryGuesses(guesses: PuzzleHistoryGuess[]): PuzzleHistoryGuess[] {
  return guesses.slice(0, GAME_MAX_GUESSES).map(guess => ({
    chords: guess.chords.map(chord => ({ ...chord })),
  }))
}

export function arePuzzleHistoryGuessesEqual(
  currentGuesses: PuzzleHistoryGuess[] | undefined,
  nextGuesses: PuzzleHistoryGuess[] | undefined,
): boolean {
  if ((currentGuesses?.length ?? 0) !== (nextGuesses?.length ?? 0)) {
    return false
  }

  return (nextGuesses ?? []).every((guess, guessIndex) => {
    const currentGuess = currentGuesses?.[guessIndex]

    if (!currentGuess || currentGuess.chords.length !== guess.chords.length) {
      return false
    }

    return guess.chords.every((chord, chordIndex) => {
      return areChordIdsEqual(chord, currentGuess.chords[chordIndex])
    })
  })
}

function arePuzzleHistoryEntriesEqual(
  currentEntry: PuzzleHistoryEntry | undefined,
  nextEntry: PuzzleHistoryEntry,
): boolean {
  if (!currentEntry) {
    return false
  }

  return currentEntry.completed === nextEntry.completed
    && currentEntry.completedAt === nextEntry.completedAt
    && currentEntry.failed === nextEntry.failed
    && currentEntry.failedAt === nextEntry.failedAt
    && currentEntry.attemptsUsed === nextEntry.attemptsUsed
    && arePuzzleHistoryGuessesEqual(currentEntry.guesses, nextEntry.guesses)
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

function sanitizeStoredGuess(
  value: unknown,
  difficulty: PuzzleDifficulty,
): PuzzleHistoryGuess | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const guess = value as Partial<PuzzleHistoryGuess>

  if (!Array.isArray(guess.chords) || guess.chords.length !== GAME_MAX_CHARS) {
    return null
  }

  if (!guess.chords.every(chord => isChordId(chord) && isChordAllowedForDifficulty(chord, difficulty))) {
    return null
  }

  return {
    chords: guess.chords.map(chord => ({ ...chord })),
  }
}

function sanitizeStoredGuesses(
  value: unknown,
  difficulty: PuzzleDifficulty,
): PuzzleHistoryGuess[] | undefined {
  if (value === undefined || !Array.isArray(value)) {
    return undefined
  }

  const guesses = value
    .slice(0, GAME_MAX_GUESSES)
    .map(guess => sanitizeStoredGuess(guess, difficulty))
    .filter((guess): guess is PuzzleHistoryGuess => guess !== null)

  return guesses.length ? guesses : undefined
}

function sanitizeEntry(date: string, value: unknown): PuzzleHistoryEntry | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const entry = value as Partial<PuzzleHistoryEntry>

  if (typeof entry.completed !== 'boolean') {
    return null
  }

  if (entry.completedAt !== undefined && typeof entry.completedAt !== 'string') {
    return null
  }

  if (entry.failed !== undefined && typeof entry.failed !== 'boolean') {
    return null
  }

  if (entry.failedAt !== undefined && typeof entry.failedAt !== 'string') {
    return null
  }

  if (entry.attemptsUsed !== undefined && typeof entry.attemptsUsed !== 'number') {
    return null
  }

  const puzzle = resolveDailyPuzzle(date)
  const guesses = sanitizeStoredGuesses(entry.guesses, puzzle.difficulty)

  return {
    completed: entry.completed,
    completedAt: entry.completedAt,
    failed: entry.failed,
    failedAt: entry.failedAt,
    attemptsUsed: entry.attemptsUsed,
    guesses,
  }
}

function parsePuzzleHistoryStore(value: unknown): PuzzleHistoryStore | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const maybeStore = value as Partial<PuzzleHistoryStore>

  if (maybeStore.version !== 2 || typeof maybeStore.entries !== 'object' || !maybeStore.entries) {
    return null
  }

  const entries: Record<string, PuzzleHistoryEntry> = {}

  for (const [date, entry] of Object.entries(maybeStore.entries)) {
    const sanitizedEntry = sanitizeEntry(date, entry)

    if (sanitizedEntry) {
      entries[date] = sanitizedEntry
    }
  }

  return {
    version: 2,
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

    if (JSON.stringify(store) !== raw) {
      writePuzzleHistory(store)
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
  guesses?: PuzzleHistoryGuess[],
): PuzzleHistoryStore {
  const currentEntry = store.entries[date]
  const nextGuesses = guesses ? clonePuzzleHistoryGuesses(guesses) : currentEntry?.guesses

  if (currentEntry?.completed) {
    const nextEntry: PuzzleHistoryEntry = {
      ...currentEntry,
      failed: false,
      failedAt: undefined,
      attemptsUsed: attemptsUsed ?? currentEntry.attemptsUsed,
      guesses: nextGuesses,
    }

    if (arePuzzleHistoryEntriesEqual(currentEntry, nextEntry)) {
      return store
    }

    return {
      version: 2,
      entries: {
        ...store.entries,
        [date]: nextEntry,
      },
    }
  }

  return {
    version: 2,
    entries: {
      ...store.entries,
      [date]: {
        completed: true,
        completedAt: new Date().toISOString(),
        failed: false,
        failedAt: undefined,
        attemptsUsed,
        guesses: nextGuesses,
      },
    },
  }
}

export function markPuzzleFailed(
  store: PuzzleHistoryStore,
  date: string,
  attemptsUsed?: number,
  guesses?: PuzzleHistoryGuess[],
): PuzzleHistoryStore {
  const currentEntry = store.entries[date]
  const nextGuesses = guesses ? clonePuzzleHistoryGuesses(guesses) : currentEntry?.guesses

  if (currentEntry?.completed) {
    return store
  }

  if (currentEntry?.failed) {
    const nextEntry: PuzzleHistoryEntry = {
      ...currentEntry,
      attemptsUsed: attemptsUsed ?? currentEntry.attemptsUsed,
      guesses: nextGuesses,
    }

    if (arePuzzleHistoryEntriesEqual(currentEntry, nextEntry)) {
      return store
    }

    return {
      version: 2,
      entries: {
        ...store.entries,
        [date]: nextEntry,
      },
    }
  }

  return {
    version: 2,
    entries: {
      ...store.entries,
      [date]: {
        completed: false,
        completedAt: currentEntry?.completedAt,
        failed: true,
        failedAt: new Date().toISOString(),
        attemptsUsed,
        guesses: nextGuesses,
      },
    },
  }
}

export function savePuzzleGuesses(
  store: PuzzleHistoryStore,
  date: string,
  guesses: PuzzleHistoryGuess[],
): PuzzleHistoryStore {
  const currentEntry = store.entries[date]
  const nextGuesses = clonePuzzleHistoryGuesses(guesses)
  const nextEntry: PuzzleHistoryEntry = {
    completed: currentEntry?.completed ?? false,
    completedAt: currentEntry?.completedAt,
    failed: currentEntry?.failed,
    failedAt: currentEntry?.failedAt,
    attemptsUsed: currentEntry?.attemptsUsed,
    guesses: nextGuesses.length ? nextGuesses : undefined,
  }

  if (arePuzzleHistoryEntriesEqual(currentEntry, nextEntry)) {
    return store
  }

  return {
    version: 2,
    entries: {
      ...store.entries,
      [date]: nextEntry,
    },
  }
}

export function removePuzzleHistoryEntry(store: PuzzleHistoryStore, date: string): PuzzleHistoryStore {
  if (!(date in store.entries)) {
    return store
  }

  const entries = { ...store.entries }
  delete entries[date]

  return {
    version: 2,
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

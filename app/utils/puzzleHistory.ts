import { PUZZLE_HISTORY_STORAGE_KEY } from '~/constant'

export type PuzzleHistoryEntry = {
  completed: boolean
  completedAt?: string
  attemptsUsed?: number
}

export type PuzzleHistoryStore = {
  version: 1
  entries: Record<string, PuzzleHistoryEntry>
}

const EMPTY_STORE: PuzzleHistoryStore = {
  version: 1,
  entries: {},
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
  } catch {
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
  } catch {
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
      },
    },
  }
}

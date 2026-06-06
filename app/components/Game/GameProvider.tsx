import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { type Chord, GameContext, type Guess, type HintProgress } from './context/GameContext'
import { useStatus } from './hooks/useStatus'
import { createSubmittedGuess } from './logic/game'
import { createEmptyGuess, createResetSessionState, isGameOverStatus } from './logic/session'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'
import { endSequence, stopSequence } from '~/utils/chain'
import { getCatalogDatesDesc, getEnabledPaletteSectionIds, resolveDailyPuzzle } from '~/utils/dailyPuzzle'
import { formatLocalDate } from '~/utils/date'
import { DEFAULT_KEY, DEFAULT_MODE_ID, filterPaletteSections, flattenPaletteSections, getPaletteSections, type ModeId, normalizeChordLabel, normalizeKey, normalizeModeId } from '~/utils/music'
import {
  calculateCurrentStreak,
  markPuzzleCompleted,
  markPuzzleFailed,
  readPuzzleHistory,
  removePuzzleHistoryEntry,
  revealPuzzleHint,
  writePuzzleHistory,
} from '~/utils/puzzleHistory'

type Props = {
  children: React.ReactNode
}

export function GameProvider({ children }: Props) {
  const toHintProgress = (value?: number): HintProgress => {
    if (value === 1 || value === 2) {
      return value
    }

    return 0
  }

  const todayDate = useMemo(() => formatLocalDate(new Date()), [])
  const [selectedPuzzleDate, setSelectedPuzzleDate] = useState(todayDate)
  const activePuzzle = useMemo(() => resolveDailyPuzzle(selectedPuzzleDate), [selectedPuzzleDate])
  const [selectedKey, setSelectedKey] = useState(DEFAULT_KEY)
  const [selectedMode, setSelectedMode] = useState<ModeId>(DEFAULT_MODE_ID)
  const [historyStore, setHistoryStore] = useState(readPuzzleHistory)
  const hintProgress = toHintProgress(historyStore.entries[activePuzzle.date]?.hintsUsed)
  const hasCompletedActivePuzzle = historyStore.entries[activePuzzle.date]?.completed === true
  const hasFailedActivePuzzle = historyStore.entries[activePuzzle.date]?.failed === true

  useEffect(() => {
    if (hintProgress >= 1) {
      setSelectedKey(activePuzzle.key)
    }
    else {
      setSelectedKey(DEFAULT_KEY)
    }

    if (hintProgress >= 2) {
      setSelectedMode(activePuzzle.mode)
    }
    else if (hintProgress === 0) {
      setSelectedMode(DEFAULT_MODE_ID)
    }
  }, [hintProgress, activePuzzle.key, activePuzzle.mode])

  const paletteSections = useMemo(
    () => getPaletteSections(selectedKey, selectedMode),
    [selectedKey, selectedMode],
  )
  const enabledPaletteSectionIds = useMemo(
    () => getEnabledPaletteSectionIds(activePuzzle.difficulty),
    [activePuzzle.difficulty],
  )
  const enabledPaletteSections = useMemo(
    () => filterPaletteSections(paletteSections, enabledPaletteSectionIds),
    [paletteSections, enabledPaletteSectionIds],
  )
  const paletteChords = useMemo(
    () => flattenPaletteSections(enabledPaletteSections),
    [enabledPaletteSections],
  )
  const puzzlePaletteChords = useMemo(() => {
    const puzzlePaletteSections = getPaletteSections(activePuzzle.key, activePuzzle.mode)
    const enabledPuzzlePaletteSections = filterPaletteSections(puzzlePaletteSections, enabledPaletteSectionIds)

    return flattenPaletteSections(enabledPuzzlePaletteSections)
  }, [activePuzzle.key, activePuzzle.mode, enabledPaletteSectionIds])
  const normalizedTarget = useMemo(
    () => activePuzzle.target.map(chord => normalizeChordLabel(chord)),
    [activePuzzle.target],
  )
  const target: Chord[] = useMemo(() => {
    const invalidTargetChords = normalizedTarget.filter(chord => !puzzlePaletteChords.includes(chord))

    if (!invalidTargetChords.length) {
      return normalizedTarget
    }

    console.warn(
      `[game] Puzzle '${activePuzzle.date}' contains target chords missing from the ${activePuzzle.difficulty} palette: ${invalidTargetChords.join(', ')}. `
      + `Falling back to first ${GAME_MAX_CHARS} palette chords.`,
    )

    return puzzlePaletteChords.slice(0, GAME_MAX_CHARS)
  }, [activePuzzle.date, activePuzzle.difficulty, normalizedTarget, puzzlePaletteChords])
  const puzzleDates = useMemo(() => getCatalogDatesDesc(todayDate), [todayDate])
  const currentStreak = useMemo(
    () => calculateCurrentStreak(historyStore.entries, todayDate).current,
    [historyStore.entries, todayDate],
  )

  const initialState = createResetSessionState()
  const [guesses, setGuesses] = useState<Guess[]>(initialState.guesses)
  const [status, setStatus] = useStatus(
    guesses,
    target,
    hasCompletedActivePuzzle ? 'won' : hasFailedActivePuzzle ? 'loss' : initialState.status,
  )
  const [current, setCurrent] = useState<Guess>(initialState.current)
  const prevStatusRef = useRef(status)
  const isGameOver = isGameOverStatus(status)

  const resetSession = useCallback((nextStatus: typeof initialState.status = 'new') => {
    const resetState = createResetSessionState()

    stopSequence()
    endSequence()
    setStatus(nextStatus)
    setGuesses(resetState.guesses)
    setCurrent(resetState.current)
  }, [setGuesses, setStatus, setCurrent])

  const getStoredPuzzleStatus = useCallback((date: string): typeof initialState.status => {
    const entry = historyStore.entries[date]

    if (entry?.completed) {
      return 'won'
    }

    if (entry?.failed) {
      return 'loss'
    }

    return 'new'
  }, [historyStore.entries])

  const handleSelectPuzzleDate = useCallback((date: string) => {
    if (!puzzleDates.includes(date)) {
      return
    }

    setSelectedPuzzleDate(date)
    resetSession(getStoredPuzzleStatus(date))
  }, [getStoredPuzzleStatus, puzzleDates, resetSession])

  const handleSetSelectedKey = useCallback((key: string) => {
    setSelectedKey(normalizeKey(key))
  }, [])

  const handleSetSelectedMode = useCallback((mode: ModeId) => {
    setSelectedMode(normalizeModeId(mode))
  }, [])

  const handleRevealHint = useCallback(() => {
    setHistoryStore((prev) => {
      const next = revealPuzzleHint(prev, activePuzzle.date)

      if (next !== prev) {
        writePuzzleHistory(next)
      }

      return next
    })
  }, [activePuzzle.date])

  useEffect(() => {
    const previousStatus = prevStatusRef.current

    if (status === 'won' && previousStatus !== 'won') {
      setHistoryStore((prev) => {
        const next = markPuzzleCompleted(prev, activePuzzle.date, guesses.length)

        if (next !== prev) {
          writePuzzleHistory(next)
        }

        return next
      })
    }
    else if (status === 'loss' && previousStatus !== 'loss') {
      setHistoryStore((prev) => {
        const next = markPuzzleFailed(prev, activePuzzle.date, guesses.length)

        if (next !== prev) {
          writePuzzleHistory(next)
        }

        return next
      })
    }

    prevStatusRef.current = status
  }, [status, activePuzzle.date, guesses.length])

  const handleSubmitGuess = useCallback(() => {
    if (isGameOver) {
      return
    }

    if (!current.chords.length) {
      return
    }

    if (current.chords.length !== GAME_MAX_CHARS) {
      return
    }

    if (guesses.length >= GAME_MAX_GUESSES) {
      return
    }

    const submittedGuess = createSubmittedGuess(current.chords, target)

    setGuesses(prev => ([...prev, submittedGuess]))
    setStatus(prev => (prev === 'new' ? 'started' : prev))
    setCurrent(createEmptyGuess())
  }, [isGameOver, current.chords, guesses.length, setGuesses, setStatus, setCurrent, target])

  const handleAddCurrent = useCallback((chord: Chord) => {
    if (isGameOver || current.chords.length >= GAME_MAX_CHARS) {
      return
    }

    if (!paletteChords.includes(chord)) {
      return
    }

    setCurrent(prev => ({
      ...prev,
      chords: [...prev.chords, chord],
      status: [],
    }))
    setStatus(prev => (prev === 'new' ? 'started' : prev))
  }, [isGameOver, current.chords.length, paletteChords, setCurrent, setStatus])

  const handleRemoveCurrent = useCallback(() => {
    if (isGameOver) {
      return
    }

    setCurrent(prev => ({
      ...prev,
      chords: [...prev.chords.slice(0, -1)],
      status: [],
    }))
  }, [isGameOver, setCurrent])

  const handleReset = useCallback(() => {
    resetSession(getStoredPuzzleStatus(activePuzzle.date))
  }, [activePuzzle.date, getStoredPuzzleStatus, resetSession])

  const handleResetToday = useCallback(() => {
    setHistoryStore((prev) => {
      const next = removePuzzleHistoryEntry(prev, activePuzzle.date)

      if (next !== prev) {
        writePuzzleHistory(next)
      }

      return next
    })
    resetSession()
  }, [activePuzzle.date, resetSession])

  return (
    <GameContext.Provider value={{
      status,
      isGameOver,
      activePuzzle,
      selectedKey,
      selectedMode,
      hintProgress,
      todayDate,
      selectedPuzzleDate,
      currentStreak,
      paletteSections,
      enabledPaletteSectionIds,
      paletteChords,
      target,
      guesses,
      current,
      puzzleDates,
      historyEntries: historyStore.entries,
      maxLength: GAME_MAX_CHARS,
      maxGuesses: GAME_MAX_GUESSES,
      selectPuzzleDate: handleSelectPuzzleDate,
      setSelectedKey: handleSetSelectedKey,
      setSelectedMode: handleSetSelectedMode,
      revealHint: handleRevealHint,
      addCurrent: handleAddCurrent,
      removeCurrent: handleRemoveCurrent,
      submitGuess: handleSubmitGuess,
      reset: handleReset,
      resetToday: handleResetToday,
    }}
    >
      {children}
    </GameContext.Provider>
  )
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { type Chord, GameContext, type Guess } from './context/GameContext'
import { useStatus } from './hooks/useStatus'
import { createSubmittedGuess, getPuzzleTarget } from './logic/game'
import { createEmptyGuess, createSessionStateFromHistory, isGameOverStatus } from './logic/session'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'
import { endSequence, stopSequence } from '~/utils/chain'
import { getCatalogDatesDesc, getEnabledPaletteSectionIds, resolveDailyPuzzle, resolvePuzzleDateFromSlug } from '~/utils/dailyPuzzle'
import { formatLocalDate } from '~/utils/date'
import { filterPaletteSections, flattenPaletteSections, getPaletteSections, type ModeId, normalizeKey, normalizeModeId } from '~/utils/music'
import {
  arePuzzleHistoryGuessesEqual,
  calculateCurrentStreak,
  markPuzzleCompleted,
  markPuzzleFailed,
  type PuzzleHistoryStore,
  readPuzzleHistory,
  removePuzzleHistoryEntry,
  savePuzzleGuesses,
  writePuzzleHistory,
} from '~/utils/puzzleHistory'

type Props = {
  children: React.ReactNode
  routePuzzleSlug?: string
}

export function GameProvider({ children, routePuzzleSlug }: Props) {
  const todayDate = useMemo(() => formatLocalDate(new Date()), [])
  const [selectedPuzzleDate, setSelectedPuzzleDate] = useState(() => resolvePuzzleDateFromSlug(routePuzzleSlug, todayDate))
  const activePuzzle = useMemo(() => resolveDailyPuzzle(selectedPuzzleDate), [selectedPuzzleDate])
  const [selectedKey, setSelectedKey] = useState(activePuzzle.key)
  const [selectedMode, setSelectedMode] = useState<ModeId>(activePuzzle.mode)
  const [historyStore, setHistoryStore] = useState(readPuzzleHistory)

  useEffect(() => {
    setSelectedKey(activePuzzle.key)
    setSelectedMode(activePuzzle.mode)
  }, [activePuzzle.key, activePuzzle.mode])

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
  const target: Chord[] = useMemo(() => getPuzzleTarget(activePuzzle), [activePuzzle])
  const puzzleDates = useMemo(() => getCatalogDatesDesc(todayDate), [todayDate])
  const currentStreak = useMemo(
    () => calculateCurrentStreak(historyStore.entries, todayDate).current,
    [historyStore.entries, todayDate],
  )

  const initialSessionState = createSessionStateFromHistory(historyStore.entries[activePuzzle.date], target)
  const [guesses, setGuesses] = useState<Guess[]>(initialSessionState.guesses)
  const [status, setStatus] = useStatus(guesses, target, initialSessionState.status)
  const [current, setCurrent] = useState<Guess>(initialSessionState.current)
  const activePuzzleDateRef = useRef(activePuzzle.date)
  const isGameOver = isGameOverStatus(status)

  const commitHistoryStore = useCallback((getNextStore: (prev: PuzzleHistoryStore) => PuzzleHistoryStore) => {
    setHistoryStore((prev) => {
      const next = getNextStore(prev)

      if (next !== prev) {
        writePuzzleHistory(next)
      }

      return next
    })
  }, [])

  const loadSessionForDate = useCallback((date: string, nextTarget: Chord[]) => {
    const entry = historyStore.entries[date]
    const nextSessionState = createSessionStateFromHistory(entry, nextTarget)

    stopSequence()
    endSequence()
    setStatus(nextSessionState.status)
    setGuesses(nextSessionState.guesses)
    setCurrent(nextSessionState.current)

    if (entry?.guesses && !arePuzzleHistoryGuessesEqual(entry.guesses, nextSessionState.guesses)) {
      commitHistoryStore(prev => savePuzzleGuesses(prev, date, nextSessionState.guesses))
    }
  }, [commitHistoryStore, historyStore.entries])

  const handleSelectPuzzleDate = useCallback((date: string) => {
    if (!puzzleDates.includes(date)) {
      return
    }

    const nextPuzzle = resolveDailyPuzzle(date)

    setSelectedPuzzleDate(date)
    loadSessionForDate(date, getPuzzleTarget(nextPuzzle))
  }, [loadSessionForDate, puzzleDates])

  useEffect(() => {
    const nextSelectedPuzzleDate = resolvePuzzleDateFromSlug(routePuzzleSlug, todayDate)

    if (nextSelectedPuzzleDate === selectedPuzzleDate) {
      return
    }

    const nextPuzzle = resolveDailyPuzzle(nextSelectedPuzzleDate)

    setSelectedPuzzleDate(nextSelectedPuzzleDate)
    loadSessionForDate(nextSelectedPuzzleDate, getPuzzleTarget(nextPuzzle))
  }, [loadSessionForDate, routePuzzleSlug, selectedPuzzleDate, todayDate])

  useEffect(() => {
    if (activePuzzleDateRef.current === activePuzzle.date) {
      return
    }

    activePuzzleDateRef.current = activePuzzle.date
    loadSessionForDate(activePuzzle.date, target)
  }, [activePuzzle.date, loadSessionForDate, target])

  const handleSetSelectedKey = useCallback((key: string) => {
    setSelectedKey(normalizeKey(key))
  }, [])

  const handleSetSelectedMode = useCallback((mode: ModeId) => {
    setSelectedMode(normalizeModeId(mode))
  }, [])

  useEffect(() => {
    commitHistoryStore((prev) => {
      const entry = prev.entries[activePuzzle.date]

      if (!entry?.guesses || arePuzzleHistoryGuessesEqual(entry.guesses, guesses)) {
        return prev
      }

      return savePuzzleGuesses(prev, activePuzzle.date, guesses)
    })
  }, [activePuzzle.date, commitHistoryStore, guesses])

  useEffect(() => {
    if (status === 'won') {
      commitHistoryStore((prev) => {
        const entry = prev.entries[activePuzzle.date]

        if (entry?.completed && (!guesses.length || entry.guesses)) {
          return prev
        }

        return markPuzzleCompleted(prev, activePuzzle.date, guesses.length, guesses)
      })
    }
    else if (status === 'loss') {
      commitHistoryStore((prev) => {
        const entry = prev.entries[activePuzzle.date]

        if (entry?.failed && (!guesses.length || entry.guesses)) {
          return prev
        }

        return markPuzzleFailed(prev, activePuzzle.date, guesses.length, guesses)
      })
    }
  }, [status, activePuzzle.date, commitHistoryStore, guesses])

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
    const nextGuesses = [...guesses, submittedGuess]

    setGuesses(nextGuesses)
    commitHistoryStore(prev => savePuzzleGuesses(prev, activePuzzle.date, nextGuesses))
    setStatus(prev => (prev === 'new' ? 'started' : prev))
    setCurrent(createEmptyGuess())
  }, [isGameOver, current.chords, guesses, setGuesses, setStatus, setCurrent, target, activePuzzle.date, commitHistoryStore])

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
    loadSessionForDate(activePuzzle.date, target)
  }, [activePuzzle.date, loadSessionForDate, target])

  const handleResetToday = useCallback(() => {
    commitHistoryStore(prev => removePuzzleHistoryEntry(prev, activePuzzle.date))
    stopSequence()
    endSequence()
    setStatus('new')
    setGuesses([])
    setCurrent(createEmptyGuess())
  }, [activePuzzle.date, commitHistoryStore, setStatus])

  return (
    <GameContext.Provider value={{
      status,
      isGameOver,
      activePuzzle,
      selectedKey,
      selectedMode,
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

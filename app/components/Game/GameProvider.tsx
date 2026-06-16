import { useCallback, useEffect, useMemo, useState } from 'react'

import { type Chord, GameContext } from './context/GameContext'
import { createSubmittedGuess, getPuzzleTarget } from './logic/game'
import { createEmptyGuess, createResetSessionState, createSessionStateFromHistory, getNextStatusFromGuesses, isGameOverStatus } from './logic/session'
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

  const initialSessionState = createSessionStateFromHistory(activePuzzle.date, historyStore.entries[activePuzzle.date], target)
  const [session, setSession] = useState(initialSessionState)
  const isSessionActivePuzzle = session.puzzleDate === activePuzzle.date
  const isGameOver = isGameOverStatus(session.status)

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
    const nextSessionState = createSessionStateFromHistory(date, entry, nextTarget)

    stopSequence()
    endSequence()
    setSession(nextSessionState)

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
    if (!isSessionActivePuzzle) {
      return
    }

    setSession((prev) => {
      const nextStatus = getNextStatusFromGuesses(prev.status, prev.guesses, target)

      if (nextStatus === prev.status) {
        return prev
      }

      return {
        ...prev,
        status: nextStatus,
      }
    })
  }, [isSessionActivePuzzle, session.guesses, target])

  const handleSetSelectedKey = useCallback((key: string) => {
    setSelectedKey(normalizeKey(key))
  }, [])

  const handleSetSelectedMode = useCallback((mode: ModeId) => {
    setSelectedMode(normalizeModeId(mode))
  }, [])

  useEffect(() => {
    if (!isSessionActivePuzzle) {
      return
    }

    commitHistoryStore((prev) => {
      const entry = prev.entries[session.puzzleDate]

      if (!entry?.guesses || arePuzzleHistoryGuessesEqual(entry.guesses, session.guesses)) {
        return prev
      }

      return savePuzzleGuesses(prev, session.puzzleDate, session.guesses)
    })
  }, [commitHistoryStore, isSessionActivePuzzle, session])

  useEffect(() => {
    if (!isSessionActivePuzzle) {
      return
    }

    if (session.status === 'won') {
      commitHistoryStore((prev) => {
        const entry = prev.entries[session.puzzleDate]

        if (entry?.completed && (!session.guesses.length || entry.guesses)) {
          return prev
        }

        return markPuzzleCompleted(prev, session.puzzleDate, session.guesses.length, session.guesses)
      })
    }
    else if (session.status === 'loss') {
      commitHistoryStore((prev) => {
        const entry = prev.entries[session.puzzleDate]

        if (entry?.failed && (!session.guesses.length || entry.guesses)) {
          return prev
        }

        return markPuzzleFailed(prev, session.puzzleDate, session.guesses.length, session.guesses)
      })
    }
  }, [commitHistoryStore, isSessionActivePuzzle, session])

  const handleSubmitGuess = useCallback(() => {
    if (isGameOver || !isSessionActivePuzzle) {
      return
    }

    if (!session.current.chords.length) {
      return
    }

    if (session.current.chords.length !== GAME_MAX_CHARS) {
      return
    }

    if (session.guesses.length >= GAME_MAX_GUESSES) {
      return
    }

    const submittedGuess = createSubmittedGuess(session.current.chords, target)
    const nextGuesses = [...session.guesses, submittedGuess]

    setSession(prev => ({
      ...prev,
      guesses: nextGuesses,
      status: prev.status === 'new' ? 'started' : prev.status,
      current: createEmptyGuess(),
    }))
    commitHistoryStore(prev => savePuzzleGuesses(prev, session.puzzleDate, nextGuesses))
  }, [isGameOver, isSessionActivePuzzle, session.current.chords, session.guesses, target, session.puzzleDate, commitHistoryStore])

  const handleAddCurrent = useCallback((chord: Chord) => {
    if (isGameOver || !isSessionActivePuzzle || session.current.chords.length >= GAME_MAX_CHARS) {
      return
    }

    if (!paletteChords.includes(chord)) {
      return
    }

    setSession(prev => ({
      ...prev,
      status: prev.status === 'new' ? 'started' : prev.status,
      current: {
        ...prev.current,
        chords: [...prev.current.chords, chord],
        status: [],
      },
    }))
  }, [isGameOver, isSessionActivePuzzle, session.current.chords.length, paletteChords])

  const handleRemoveCurrent = useCallback(() => {
    if (isGameOver || !isSessionActivePuzzle) {
      return
    }

    setSession(prev => ({
      ...prev,
      current: {
        ...prev.current,
        chords: [...prev.current.chords.slice(0, -1)],
        status: [],
      },
    }))
  }, [isGameOver, isSessionActivePuzzle])

  const handleReset = useCallback(() => {
    loadSessionForDate(activePuzzle.date, target)
  }, [activePuzzle.date, loadSessionForDate, target])

  const handleResetToday = useCallback(() => {
    commitHistoryStore(prev => removePuzzleHistoryEntry(prev, activePuzzle.date))
    stopSequence()
    endSequence()
    setSession(createResetSessionState(activePuzzle.date))
  }, [activePuzzle.date, commitHistoryStore])

  return (
    <GameContext.Provider value={{
      status: session.status,
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
      guesses: session.guesses,
      current: session.current,
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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { type Chord, GameContext, type Guess } from './context/GameContext'
import { useStatus } from './hooks/useStatus'
import { createSubmittedGuess } from './logic/game'
import { createEmptyGuess, createResetSessionState, isGameOverStatus } from './logic/session'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'
import { endSequence, stopSequence } from '~/utils/chain'
import { getCatalogDatesDesc, resolveDailyPuzzle } from '~/utils/dailyPuzzle'
import { formatLocalDate } from '~/utils/date'
import { flattenPaletteSections, getPaletteSections, normalizeChordLabel } from '~/utils/music'
import { markPuzzleCompleted, readPuzzleHistory, removePuzzleHistoryEntry, writePuzzleHistory } from '~/utils/puzzleHistory'

type Props = {
  children: React.ReactNode
}

export function GameProvider({ children }: Props) {
  const todayDate = useMemo(() => formatLocalDate(new Date()), [])
  const activePuzzle = useMemo(() => resolveDailyPuzzle(todayDate), [todayDate])
  const paletteSections = useMemo(
    () => getPaletteSections(activePuzzle.key, activePuzzle.mode),
    [activePuzzle.key, activePuzzle.mode],
  )
  const paletteChords = useMemo(
    () => flattenPaletteSections(paletteSections),
    [paletteSections],
  )
  const normalizedTarget = useMemo(
    () => activePuzzle.target.map(chord => normalizeChordLabel(chord)),
    [activePuzzle.target],
  )
  const target: Chord[] = useMemo(() => {
    const invalidTargetChords = normalizedTarget.filter(chord => !paletteChords.includes(chord))

    if (!invalidTargetChords.length) {
      return normalizedTarget
    }

    console.warn(
      `[game] Puzzle '${activePuzzle.date}' contains target chords missing from the generated palette: ${invalidTargetChords.join(', ')}. `
      + `Falling back to first ${GAME_MAX_CHARS} palette chords.`,
    )

    return paletteChords.slice(0, GAME_MAX_CHARS)
  }, [activePuzzle.date, normalizedTarget, paletteChords])
  const puzzleDates = useMemo(() => getCatalogDatesDesc(todayDate), [todayDate])
  const [historyStore, setHistoryStore] = useState(readPuzzleHistory)
  const hasCompletedActivePuzzle = historyStore.entries[activePuzzle.date]?.completed === true

  const initialState = createResetSessionState()
  const [guesses, setGuesses] = useState<Guess[]>(initialState.guesses)
  const [status, setStatus] = useStatus(guesses, target, hasCompletedActivePuzzle ? 'won' : initialState.status)
  const [current, setCurrent] = useState<Guess>(initialState.current)
  const prevStatusRef = useRef(status)
  const isGameOver = isGameOverStatus(status)

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
    const resetState = createResetSessionState()

    stopSequence()
    endSequence()
    setStatus(resetState.status)
    setGuesses(resetState.guesses)
    setCurrent(resetState.current)
  }, [setGuesses, setStatus, setCurrent])

  const handleResetToday = useCallback(() => {
    setHistoryStore((prev) => {
      const next = removePuzzleHistoryEntry(prev, activePuzzle.date)

      if (next !== prev) {
        writePuzzleHistory(next)
      }

      return next
    })
    handleReset()
  }, [activePuzzle.date, handleReset])

  return (
    <GameContext.Provider value={{
      status,
      isGameOver,
      activePuzzle,
      todayDate,
      paletteChords,
      target,
      guesses,
      current,
      puzzleDates,
      historyEntries: historyStore.entries,
      maxLength: GAME_MAX_CHARS,
      maxGuesses: GAME_MAX_GUESSES,
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

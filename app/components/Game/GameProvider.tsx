import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { type Chord, GameContext, type Guess } from './context/GameContext'
import { useStatus } from './hooks/useStatus'
import { createSubmittedGuess } from './logic/game'
import { createEmptyGuess, createResetSessionState, isGameOverStatus } from './logic/session'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'
import { endSequence, stopSequence } from '~/utils/chain'
import { getCatalogDatesDesc, resolveDailyPuzzle } from '~/utils/dailyPuzzle'
import { formatLocalDate } from '~/utils/date'
import { markPuzzleCompleted, readPuzzleHistory, writePuzzleHistory } from '~/utils/puzzleHistory'

type Props = {
  children: React.ReactNode
}

export function GameProvider({ children }: Props) {
  const todayDate = useMemo(() => formatLocalDate(new Date()), [])
  const activePuzzle = useMemo(() => resolveDailyPuzzle(todayDate), [todayDate])
  const target: Chord[] = activePuzzle.target
  const puzzleDates = useMemo(() => getCatalogDatesDesc(todayDate), [todayDate])

  const initialState = createResetSessionState()
  const [guesses, setGuesses] = useState<Guess[]>(initialState.guesses)
  const [status, setStatus] = useStatus(guesses, target)
  const [current, setCurrent] = useState<Guess>(initialState.current)
  const [historyStore, setHistoryStore] = useState(readPuzzleHistory)
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

    setCurrent(prev => ({
      ...prev,
      chords: [...prev.chords, chord],
      status: [],
    }))
    setStatus(prev => (prev === 'new' ? 'started' : prev))
  }, [isGameOver, current.chords.length, setCurrent, setStatus])

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

  return (
    <GameContext.Provider value={{
      status,
      isGameOver,
      activePuzzle,
      todayDate,
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
    }}
    >
      {children}
    </GameContext.Provider>
  )
}

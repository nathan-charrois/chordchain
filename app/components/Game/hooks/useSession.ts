import { useCallback, useEffect, useState } from 'react'

import type { Chord } from '../context/GameContext'
import { createSubmittedGuess } from '../logic/game'
import { createEmptyGuess, createResetSessionState, createSessionStateFromHistory, getNextStatusFromGuesses, isGameOverStatus } from '../logic/session'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'
import { endSequence, stopSequence } from '~/utils/chain'
import type { DailyPuzzle } from '~/utils/dailyPuzzle'
import {
  arePuzzleHistoryGuessesEqual,
  markPuzzleCompleted,
  markPuzzleFailed,
  type PuzzleHistoryStore,
  removePuzzleHistoryEntry,
  savePuzzleGuesses,
} from '~/utils/puzzleHistory'

type CommitHistoryStore = (getNextStore: (prev: PuzzleHistoryStore) => PuzzleHistoryStore) => void

type UseSessionProps = {
  activePuzzle: DailyPuzzle
  commitHistoryStore: CommitHistoryStore
  historyEntries: PuzzleHistoryStore['entries']
  paletteChords: Chord[]
  target: Chord[]
}

export function useSession({
  activePuzzle,
  commitHistoryStore,
  historyEntries,
  paletteChords,
  target,
}: UseSessionProps) {
  const [session, setSession] = useState(() => createSessionStateFromHistory(activePuzzle.date, historyEntries[activePuzzle.date], target))
  const isSessionActivePuzzle = session.puzzleDate === activePuzzle.date
  const isGameOver = isGameOverStatus(session.status)

  const loadSessionForDate = useCallback((date: string, nextTarget: Chord[]) => {
    const entry = historyEntries[date]
    const nextSessionState = createSessionStateFromHistory(date, entry, nextTarget)

    stopSequence()
    endSequence()
    setSession(nextSessionState)

    if (entry?.guesses && !arePuzzleHistoryGuessesEqual(entry.guesses, nextSessionState.guesses)) {
      commitHistoryStore(prev => savePuzzleGuesses(prev, date, nextSessionState.guesses))
    }
  }, [commitHistoryStore, historyEntries])

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

  const submitGuess = useCallback(() => {
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

  const addCurrent = useCallback((chord: Chord) => {
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

  const removeCurrent = useCallback(() => {
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

  const reset = useCallback(() => {
    loadSessionForDate(activePuzzle.date, target)
  }, [activePuzzle.date, loadSessionForDate, target])

  const resetToday = useCallback(() => {
    commitHistoryStore(prev => removePuzzleHistoryEntry(prev, activePuzzle.date))
    stopSequence()
    endSequence()
    setSession(createResetSessionState(activePuzzle.date))
  }, [activePuzzle.date, commitHistoryStore])

  return {
    session,
    loadSessionForDate,
    addCurrent,
    removeCurrent,
    submitGuess,
    reset,
    resetToday,
  }
}

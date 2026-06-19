import { useCallback, useEffect, useMemo, useState } from 'react'

import { GameContext } from './context/GameContext'
import { useSession } from './hooks/useSession'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'
import { getCatalogDatesDesc, resolveDailyPuzzle, resolvePuzzleDateFromSlug } from '~/utils/dailyPuzzle'
import { formatLocalDate } from '~/utils/date'
import {
  calculateCurrentStreak,
  type PuzzleHistoryStore,
  readPuzzleHistory,
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
  const [historyStore, setHistoryStore] = useState(readPuzzleHistory)
  const puzzleDates = useMemo(() => getCatalogDatesDesc(todayDate), [todayDate])
  const currentStreak = useMemo(
    () => calculateCurrentStreak(historyStore.entries, todayDate).current,
    [historyStore.entries, todayDate],
  )

  const commitHistoryStore = useCallback((getNextStore: (prev: PuzzleHistoryStore) => PuzzleHistoryStore) => {
    setHistoryStore((prev) => {
      const next = getNextStore(prev)

      if (next !== prev) {
        writePuzzleHistory(next)
      }

      return next
    })
  }, [])

  const {
    session,
    loadSessionForPuzzle,
    addCurrent,
    removeCurrent,
    submitGuess,
    reset,
    resetToday,
  } = useSession({
    activePuzzle,
    commitHistoryStore,
    historyEntries: historyStore.entries,
  })

  const handleSelectPuzzleDate = useCallback((date: string) => {
    if (!puzzleDates.includes(date)) {
      return
    }

    const nextPuzzle = resolveDailyPuzzle(date)

    setSelectedPuzzleDate(date)
    loadSessionForPuzzle(nextPuzzle)
  }, [loadSessionForPuzzle, puzzleDates])

  useEffect(() => {
    const nextSelectedPuzzleDate = resolvePuzzleDateFromSlug(routePuzzleSlug, todayDate)

    if (nextSelectedPuzzleDate === selectedPuzzleDate) {
      return
    }

    const nextPuzzle = resolveDailyPuzzle(nextSelectedPuzzleDate)

    setSelectedPuzzleDate(nextSelectedPuzzleDate)
    loadSessionForPuzzle(nextPuzzle)
  }, [loadSessionForPuzzle, routePuzzleSlug, selectedPuzzleDate, todayDate])

  return (
    <GameContext.Provider value={{
      status: session.status,
      activePuzzle,
      todayDate,
      selectedPuzzleDate,
      currentStreak,
      guesses: session.guesses,
      current: session.current,
      puzzleDates,
      historyEntries: historyStore.entries,
      maxLength: GAME_MAX_CHARS,
      maxGuesses: GAME_MAX_GUESSES,
      selectPuzzleDate: handleSelectPuzzleDate,
      addCurrent,
      removeCurrent,
      submitGuess,
      reset,
      resetToday,
    }}
    >
      {children}
    </GameContext.Provider>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'

import { type Chord, GameContext } from './context/GameContext'
import { useSession } from './hooks/useSession'
import { getPuzzleTarget } from './logic/game'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'
import { getCatalogDatesDesc, getEnabledPaletteSectionIds, resolveDailyPuzzle, resolvePuzzleDateFromSlug } from '~/utils/dailyPuzzle'
import { formatLocalDate } from '~/utils/date'
import { filterPaletteSections, flattenPaletteSections, getPaletteSections, type ModeId, normalizeKey, normalizeModeId } from '~/utils/music'
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
    loadSessionForDate,
    addCurrent,
    removeCurrent,
    submitGuess,
    reset,
    resetToday,
  } = useSession({
    activePuzzle,
    commitHistoryStore,
    historyEntries: historyStore.entries,
    paletteChords,
    target,
  })

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

  const handleSetSelectedKey = useCallback((key: string) => {
    setSelectedKey(normalizeKey(key))
  }, [])

  const handleSetSelectedMode = useCallback((mode: ModeId) => {
    setSelectedMode(normalizeModeId(mode))
  }, [])

  return (
    <GameContext.Provider value={{
      status: session.status,
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

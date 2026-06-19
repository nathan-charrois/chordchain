import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useGame } from '~/components/Game/hooks/useGame'
import { endSequence, playSequence, stopSequence } from '~/utils/chain'
import type { ChordId } from '~/utils/music'
import { buildDisplayProgression } from '~/utils/music'

const TEMPO_PLAYBACK_RESTART_DELAY_MS = 300

export type Sequence = {
  progression: ChordId[]
  activeIndex: number | null
  isPlaying: boolean
  play: (arpeggiate: boolean, loop: boolean, tempoBpm: number) => void
  stop: () => void
  end: () => void
  setLooping: (loop: boolean) => void
  restartAfterTempoChange: (arpeggiate: boolean, loop: boolean, tempoBpm: number) => void
}

type SequenceProviderProps = {
  children: ReactNode
}

export const SequenceContext = createContext<Sequence | undefined>(undefined)

export function SequenceProvider({ children }: SequenceProviderProps) {
  const { activePuzzle, guesses } = useGame()
  const shouldLoopRef = useRef(false)
  const tempoRestartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeIndex, setIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const progressionNotes = useMemo(() => {
    return buildDisplayProgression(
      activePuzzle.key,
      activePuzzle.mode,
      activePuzzle.progression,
    ).map(chord => chord.notes)
  }, [activePuzzle.key, activePuzzle.mode, activePuzzle.progression])

  const clearPendingTempoRestart = useCallback(() => {
    if (!tempoRestartTimeoutRef.current) {
      return
    }

    clearTimeout(tempoRestartTimeoutRef.current)
    tempoRestartTimeoutRef.current = null
  }, [])

  useEffect(() => {
    if (!guesses.length) {
      setIndex(null)
    }
  }, [guesses.length])

  useEffect(() => {
    clearPendingTempoRestart()
    stopSequence()
    setIndex(null)
    setIsPlaying(false)
  }, [activePuzzle.date, clearPendingTempoRestart])

  useEffect(() => clearPendingTempoRestart, [clearPendingTempoRestart])

  const handlePlay = useCallback((arpeggiate: boolean, loop: boolean, tempoBpm: number) => {
    clearPendingTempoRestart()
    shouldLoopRef.current = loop
    setIsPlaying(true)
    playSequence({
      chords: progressionNotes,
      arpeggiate,
      shouldLoop: () => shouldLoopRef.current,
      tempoBpm,
      setIndex,
      onComplete: () => {
        clearPendingTempoRestart()
        setIsPlaying(false)
      },
    })
  }, [progressionNotes, setIndex, clearPendingTempoRestart])

  const handleStop = useCallback(() => {
    clearPendingTempoRestart()
    stopSequence()
    setIndex(null)
    setIsPlaying(false)
  }, [clearPendingTempoRestart])

  const handleEnd = useCallback(() => {
    clearPendingTempoRestart()
    endSequence()
    setIndex(null)
    setIsPlaying(false)
  }, [setIndex, clearPendingTempoRestart])

  const handleSetLooping = useCallback((loop: boolean) => {
    shouldLoopRef.current = loop
  }, [])

  const handleRestartAfterTempoChange = useCallback((arpeggiate: boolean, loop: boolean, tempoBpm: number) => {
    clearPendingTempoRestart()
    tempoRestartTimeoutRef.current = setTimeout(() => {
      tempoRestartTimeoutRef.current = null
      handlePlay(arpeggiate, loop, tempoBpm)
    }, TEMPO_PLAYBACK_RESTART_DELAY_MS)
  }, [clearPendingTempoRestart, handlePlay])

  const value = useMemo(() => ({
    progression: activePuzzle.progression,
    activeIndex,
    isPlaying,
    play: handlePlay,
    stop: handleStop,
    end: handleEnd,
    setLooping: handleSetLooping,
    restartAfterTempoChange: handleRestartAfterTempoChange,
  }), [
    activePuzzle.progression,
    activeIndex,
    isPlaying,
    handlePlay,
    handleStop,
    handleEnd,
    handleSetLooping,
    handleRestartAfterTempoChange,
  ])

  return (
    <SequenceContext.Provider value={value}>
      {children}
    </SequenceContext.Provider>
  )
}

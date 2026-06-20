import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useGame } from '~/components/Game/hooks/useGame'
import { endSequence, playSequence, stopSequence } from '~/utils/chain'
import type { ChordId } from '~/utils/music'
import { buildChords } from '~/utils/music'

const PLAYBACK_RESTART_DELAY_MS = 300

export type Sequence = {
  progression: ChordId[]
  activeIndex: number | null
  isPlaying: boolean
  play: (arpeggiate: boolean, loop: boolean, tempoBpm: number) => void
  stop: () => void
  end: () => void
  setLooping: (loop: boolean) => void
  restart: (arpeggiate: boolean, loop: boolean, tempoBpm: number) => void
}

type SequenceProviderProps = {
  children: ReactNode
}

export const SequenceContext = createContext<Sequence | undefined>(undefined)

export function SequenceProvider({ children }: SequenceProviderProps) {
  const { activePuzzle, guesses } = useGame()
  const shouldLoopRef = useRef(false)
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeIndex, setIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const arpeggiateType = useMemo(() => {
    return activePuzzle.arpeggiateType
  }, [activePuzzle.arpeggiateType])

  const chords = useMemo(() => {
    return buildChords(
      activePuzzle.key,
      activePuzzle.mode,
      activePuzzle.progression,
    ).map(chord => chord.notes)
  }, [activePuzzle.key, activePuzzle.mode, activePuzzle.progression])

  const clearRestartTimeoutRef = useCallback(() => {
    if (!restartTimeoutRef.current) {
      return
    }

    clearTimeout(restartTimeoutRef.current)
    restartTimeoutRef.current = null
  }, [])

  useEffect(() => {
    if (!guesses.length) {
      setIndex(null)
    }
  }, [guesses.length])

  useEffect(() => {
    clearRestartTimeoutRef()
    stopSequence()
    setIndex(null)
    setIsPlaying(false)
  }, [activePuzzle.date, clearRestartTimeoutRef])

  useEffect(() => clearRestartTimeoutRef, [clearRestartTimeoutRef])

  const handlePlay = useCallback((arpeggiate: boolean, loop: boolean, tempoBpm: number) => {
    clearRestartTimeoutRef()
    shouldLoopRef.current = loop
    setIsPlaying(true)
    playSequence({
      chords,
      arpeggiate,
      arpeggiateType,
      shouldLoop: () => shouldLoopRef.current,
      tempoBpm,
      setIndex,
      onComplete: () => {
        clearRestartTimeoutRef()
        setIsPlaying(false)
      },
    })
  }, [chords, arpeggiateType, setIndex, clearRestartTimeoutRef])

  const handleStop = useCallback(() => {
    clearRestartTimeoutRef()
    stopSequence()
    setIndex(null)
    setIsPlaying(false)
  }, [clearRestartTimeoutRef])

  const handleEnd = useCallback(() => {
    clearRestartTimeoutRef()
    endSequence()
    setIndex(null)
    setIsPlaying(false)
  }, [setIndex, clearRestartTimeoutRef])

  const handleSetLooping = useCallback((loop: boolean) => {
    shouldLoopRef.current = loop
  }, [])

  const handleRestart = useCallback((arpeggiate: boolean, loop: boolean, tempoBpm: number) => {
    clearRestartTimeoutRef()
    stopSequence()
    setIndex(null)
    restartTimeoutRef.current = setTimeout(() => {
      restartTimeoutRef.current = null
      handlePlay(arpeggiate, loop, tempoBpm)
    }, PLAYBACK_RESTART_DELAY_MS)
  }, [clearRestartTimeoutRef, handlePlay])

  const value = useMemo(() => ({
    progression: activePuzzle.progression,
    activeIndex,
    isPlaying,
    play: handlePlay,
    stop: handleStop,
    end: handleEnd,
    setLooping: handleSetLooping,
    restart: handleRestart,
  }), [
    activePuzzle.progression,
    activeIndex,
    isPlaying,
    handlePlay,
    handleStop,
    handleEnd,
    handleSetLooping,
    handleRestart,
  ])

  return (
    <SequenceContext.Provider value={value}>
      {children}
    </SequenceContext.Provider>
  )
}

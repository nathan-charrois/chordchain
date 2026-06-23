import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useGame } from '~/components/Game/hooks/useGame'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'
import { DEFAULT_TEMPO_BPM, endSequence, playSequence, stopSequence } from '~/utils/chain'
import type { ChordId } from '~/utils/music'
import { buildChords } from '~/utils/music'

const PLAYBACK_RESTART_DELAY_MS = 300

export type Sequence = {
  progression: ChordId[]
  activeIndex: number | null
  isPlaying: boolean
  isGuessPlaying: boolean
  isSubmittingGuess: boolean
  play: (options: SequencePlaybackOptions) => void
  stop: () => void
  end: () => void
  restart: (options: SequencePlaybackOptions) => void
  submitGuess: () => void
}

type SequencePlaybackOptions = {
  arpeggiate: boolean
  drums: boolean
  loop: boolean
  tempoBpm: number
}

type SequenceProviderProps = {
  children: ReactNode
}

type PendingGuess = {
  notes: string[][]
  started: boolean
}

export const SequenceContext = createContext<Sequence | undefined>(undefined)

export function SequenceProvider({ children }: SequenceProviderProps) {
  const {
    activePuzzle,
    current,
    guesses,
    status,
    submitGuess,
  } = useGame()
  const shouldLoopRef = useRef(false)
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingGuessRef = useRef<PendingGuess | null>(null)
  const submitGuessRef = useRef(submitGuess)
  const playbackOptionsRef = useRef<SequencePlaybackOptions>({
    arpeggiate: false,
    drums: false,
    loop: true,
    tempoBpm: DEFAULT_TEMPO_BPM,
  })
  const [activeIndex, setIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGuessPlaying, setIsGuessPlaying] = useState(false)
  const [isSubmittingGuess, setIsSubmittingGuess] = useState(false)

  submitGuessRef.current = submitGuess

  const arpeggiateType = useMemo(() => {
    return activePuzzle.arpeggiateType
  }, [activePuzzle.arpeggiateType])

  const drumLoopId = useMemo(() => {
    return activePuzzle.drumLoopId
  }, [activePuzzle.drumLoopId])

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

  const clearPendingGuess = useCallback(() => {
    pendingGuessRef.current = null
    setIsGuessPlaying(false)
    setIsSubmittingGuess(false)
  }, [])

  const completePendingGuess = useCallback(() => {
    if (!pendingGuessRef.current) {
      return
    }

    clearPendingGuess()
    submitGuessRef.current()
  }, [clearPendingGuess])

  const takePendingGuess = useCallback(() => {
    const pendingGuess = pendingGuessRef.current

    if (!pendingGuess || pendingGuess.started) {
      return null
    }

    pendingGuess.started = true

    return {
      chords: pendingGuess.notes,
      onStart: () => {
        setIndex(null)
        setIsGuessPlaying(true)
      },
      onComplete: completePendingGuess,
    }
  }, [completePendingGuess])

  useEffect(() => {
    if (!guesses.length) {
      setIndex(null)
    }
  }, [guesses.length])

  useEffect(() => {
    clearRestartTimeoutRef()
    stopSequence()
    clearPendingGuess()
    setIndex(null)
    setIsPlaying(false)
  }, [activePuzzle.date, clearPendingGuess, clearRestartTimeoutRef])

  useEffect(() => clearRestartTimeoutRef, [clearRestartTimeoutRef])

  const handlePlay = useCallback(({ arpeggiate, drums, loop, tempoBpm }: SequencePlaybackOptions) => {
    clearRestartTimeoutRef()
    playbackOptionsRef.current = { arpeggiate, drums, loop, tempoBpm }
    shouldLoopRef.current = loop
    setIsPlaying(true)
    playSequence({
      chords,
      arpeggiate,
      drums,
      drumLoopId,
      arpeggiateType,
      shouldLoop: () => shouldLoopRef.current,
      tempoBpm,
      setIndex,
      takeNextSequence: takePendingGuess,
      onComplete: () => {
        clearRestartTimeoutRef()
        setIsPlaying(false)
      },
    })
  }, [chords, arpeggiateType, drumLoopId, setIndex, takePendingGuess, clearRestartTimeoutRef])

  const handleStop = useCallback(() => {
    clearRestartTimeoutRef()
    stopSequence()
    clearPendingGuess()
    setIndex(null)
    setIsPlaying(false)
  }, [clearPendingGuess, clearRestartTimeoutRef])

  const handleEnd = useCallback(() => {
    clearRestartTimeoutRef()
    endSequence()
    clearPendingGuess()
    setIndex(null)
    setIsPlaying(false)
  }, [setIndex, clearPendingGuess, clearRestartTimeoutRef])

  const handleRestart = useCallback((options: SequencePlaybackOptions) => {
    clearRestartTimeoutRef()
    stopSequence()
    clearPendingGuess()
    setIndex(null)
    restartTimeoutRef.current = setTimeout(() => {
      restartTimeoutRef.current = null
      handlePlay(options)
    }, PLAYBACK_RESTART_DELAY_MS)
  }, [clearPendingGuess, clearRestartTimeoutRef, handlePlay])

  const handleSubmitGuess = useCallback(() => {
    if (
      isSubmittingGuess
      || status === 'won'
      || status === 'loss'
      || current.chords.length !== GAME_MAX_CHARS
      || guesses.length >= GAME_MAX_GUESSES
    ) {
      return
    }

    const notes = buildChords(
      activePuzzle.key,
      activePuzzle.mode,
      current.chords,
    ).map(chord => chord.notes)

    pendingGuessRef.current = {
      notes,
      started: !isPlaying,
    }
    setIsSubmittingGuess(true)

    if (isPlaying) {
      return
    }

    const options = playbackOptionsRef.current

    setIndex(null)
    setIsGuessPlaying(true)
    setIsPlaying(true)
    playSequence({
      chords: notes,
      arpeggiate: options.arpeggiate,
      drums: options.drums,
      drumLoopId,
      arpeggiateType,
      shouldLoop: () => false,
      tempoBpm: options.tempoBpm,
      setIndex,
      onComplete: () => {
        completePendingGuess()
        setIsPlaying(false)
      },
    })
  }, [
    activePuzzle.key,
    activePuzzle.mode,
    arpeggiateType,
    completePendingGuess,
    current.chords,
    drumLoopId,
    guesses.length,
    isPlaying,
    isSubmittingGuess,
    status,
  ])

  const value = useMemo(() => ({
    progression: activePuzzle.progression,
    activeIndex,
    isPlaying,
    isGuessPlaying,
    isSubmittingGuess,
    play: handlePlay,
    stop: handleStop,
    end: handleEnd,
    restart: handleRestart,
    submitGuess: handleSubmitGuess,
  }), [
    activePuzzle.progression,
    activeIndex,
    isPlaying,
    isGuessPlaying,
    isSubmittingGuess,
    handlePlay,
    handleStop,
    handleEnd,
    handleRestart,
    handleSubmitGuess,
  ])

  return (
    <SequenceContext.Provider value={value}>
      {children}
    </SequenceContext.Provider>
  )
}

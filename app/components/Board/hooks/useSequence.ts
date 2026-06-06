import { useCallback, useEffect, useRef, useState } from 'react'

import { useGame } from '~/components/Game/hooks/useGame'
import { endSequence, playSequence, stopSequence } from '~/utils/chain'

export function useSequence() {
  const { target, guesses } = useGame()
  const shouldLoopRef = useRef(false)
  const [activeIndex, setIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!guesses.length) {
      setIndex(null)
    }
  }, [guesses.length])

  useEffect(() => {
    stopSequence()
    setIndex(null)
    setIsPlaying(false)
  }, [target])

  const handlePlay = useCallback((arpeggiate: boolean, loop: boolean, tempoBpm: number) => {
    shouldLoopRef.current = loop
    setIsPlaying(true)
    playSequence({
      chords: target,
      arpeggiate,
      shouldLoop: () => shouldLoopRef.current,
      tempoBpm,
      setIndex,
      onComplete: () => setIsPlaying(false),
    })
  }, [target, setIndex])

  const handleStop = useCallback(() => {
    stopSequence()
    setIndex(null)
    setIsPlaying(false)
  }, [])

  const handleEnd = useCallback(() => {
    endSequence()
    setIndex(null)
    setIsPlaying(false)
  }, [setIndex])

  const handleSetLooping = useCallback((loop: boolean) => {
    shouldLoopRef.current = loop
  }, [])

  return {
    target,
    activeIndex,
    isPlaying,
    play: handlePlay,
    stop: handleStop,
    end: handleEnd,
    setLooping: handleSetLooping,
  }
}

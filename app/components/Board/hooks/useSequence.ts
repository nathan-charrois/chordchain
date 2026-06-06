import { useCallback, useEffect, useState } from 'react'

import { useGame } from '~/components/Game/hooks/useGame'
import { endSequence, playSequence, stopSequence } from '~/utils/chain'

export function useSequence() {
  const { target, guesses } = useGame()
  const [activeIndex, setIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!guesses.length) {
      setIndex(null)
    }
  }, [guesses.length])

  useEffect(() => {
    stopSequence()
    setIndex(null)
  }, [target])

  const handlePlay = useCallback((arpeggiate: boolean, loop: boolean) => {
    playSequence({ chords: target, arpeggiate, loop, setIndex })
  }, [target, setIndex])

  const handleStop = useCallback(() => {
    stopSequence()
    setIndex(null)
  }, [])

  const handleEnd = useCallback(() => {
    endSequence()
    setIndex(null)
  }, [setIndex])

  return {
    target,
    activeIndex,
    play: handlePlay,
    stop: handleStop,
    end: handleEnd,
  }
}

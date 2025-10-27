import { useCallback, useState } from 'react'

import { useGame } from '~/components/Game/hooks/useGame'
import { playSequence, stopSequence } from '~/utils/chain'

export function useSequence() {
  const { target, guesses } = useGame()
  const [activeIndex, setIndex] = useState<number | null>(null)

  const handlePlay = useCallback((arpeggiate: boolean, loop: boolean) => {
    playSequence({ chords: target, arpeggiate, loop, setIndex })
  }, [target, guesses.length])

  const handleStop = useCallback(() => {
    stopSequence()
    setIndex(null)
  }, [])

  return {
    target,
    activeIndex,
    play: handlePlay,
    stop: handleStop,
  }
}

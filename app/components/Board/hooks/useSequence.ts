import { useCallback, useState } from 'react'

import { useGame } from '~/components/Game/hooks/useGame'
import { endSequence, insertSequence, playSequence, stopSequence } from '~/utils/chain'

export function useSequence() {
  const { target, guesses } = useGame()
  const [activeIndex, setIndex] = useState<number | null>(null)

  const handlePlay = useCallback((arpeggiate: boolean, loop: boolean) => {
    playSequence({ chords: target, arpeggiate, loop, setIndex })
  }, [target, setIndex])

  const handleStop = useCallback(() => {
    stopSequence()
    setIndex(null)
  }, [])

  const handleEnd = useCallback(() => {
    endSequence()
  }, [])

  const handleInsert = useCallback((arpeggiate: boolean) => {
    const chords = (guesses[guesses.length - 1]?.chords || [])
    insertSequence({ chords, arpeggiate, activeIndex, setIndex })
  }, [guesses, activeIndex])

  return {
    target,
    activeIndex,
    play: handlePlay,
    stop: handleStop,
    end: handleEnd,
    insert: handleInsert,
  }
}

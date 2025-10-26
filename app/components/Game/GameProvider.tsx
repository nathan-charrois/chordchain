import { useCallback, useState } from 'react'

import { type Chord, GameContext, type Guess } from './context/GameContext'
import { useStatus } from './hooks/useStatus'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'

type Props = {
  children: React.ReactNode
}

const target: Chord[] = ['C', 'Fm', 'Am', 'G']

const newGuess: Guess = {
  chords: [],
  status: [],
}

export function GameProvider({ children }: Props) {
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [status, setStatus] = useStatus(guesses, target)
  const [current, setCurrent] = useState<Guess>(newGuess)

  const handleSubmitGuess = useCallback(() => {
    setGuesses(prev => ([...prev, current]))
    setCurrent(newGuess)
  }, [setGuesses, setCurrent, current])

  const handleAddCurrent = useCallback((chord: Chord) => {
    setCurrent(prev => ({
      ...prev,
      chords: [...prev.chords, chord],
      status: [],
    }))
  }, [setCurrent])

  const handleRemoveCurrent = useCallback(() => {
    setCurrent(prev => ({
      ...prev,
      chords: [...prev.chords.slice(0, -1)],
      status: [],
    }))
  }, [setCurrent])

  const handleReset = useCallback(() => {
    setStatus('new')
    setGuesses([])
  }, [setGuesses, setStatus])

  return (
    <GameContext.Provider value={{
      status,
      target,
      guesses,
      current,
      maxLength: GAME_MAX_CHARS,
      maxGuesses: GAME_MAX_GUESSES,
      addCurrent: handleAddCurrent,
      removeCurrent: handleRemoveCurrent,
      submitGuess: handleSubmitGuess,
      reset: handleReset,
    }}
    >
      {children}
    </GameContext.Provider>
  )
}

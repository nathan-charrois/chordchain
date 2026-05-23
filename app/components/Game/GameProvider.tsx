import { useCallback, useState } from 'react'

import { type Chord, GameContext, type Guess } from './context/GameContext'
import { useStatus } from './hooks/useStatus'
import { createSubmittedGuess } from './logic/game'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'

const target: Chord[] = ['Em', 'Am', 'F', 'G']

const newGuess: Guess = {
  chords: [],
  status: [],
}

type Props = {
  children: React.ReactNode
}

export function GameProvider({ children }: Props) {
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [status, setStatus] = useStatus(guesses, target)
  const [current, setCurrent] = useState<Guess>(newGuess)
  const isGameOver = status === 'won' || status === 'loss'

  const handleSubmitGuess = useCallback(() => {
    if (isGameOver) {
      return
    }

    if (!current.chords.length) {
      return
    }

    if (current.chords.length !== GAME_MAX_CHARS) {
      return
    }

    if (guesses.length >= GAME_MAX_GUESSES) {
      return
    }

    const submittedGuess = createSubmittedGuess(current.chords, target)

    setGuesses(prev => ([...prev, submittedGuess]))
    setStatus(prev => (prev === 'new' ? 'started' : prev))
    setCurrent(newGuess)
  }, [isGameOver, current.chords, guesses.length, setGuesses, setStatus, setCurrent])

  const handleAddCurrent = useCallback((chord: Chord) => {
    if (isGameOver || current.chords.length >= GAME_MAX_CHARS) {
      return
    }

    setCurrent(prev => ({
      ...prev,
      chords: [...prev.chords, chord],
      status: [],
    }))
    setStatus(prev => (prev === 'new' ? 'started' : prev))
  }, [isGameOver, current.chords.length, setCurrent, setStatus])

  const handleRemoveCurrent = useCallback(() => {
    if (isGameOver) {
      return
    }

    setCurrent(prev => ({
      ...prev,
      chords: [...prev.chords.slice(0, -1)],
      status: [],
    }))
  }, [isGameOver, setCurrent])

  const handleReset = useCallback(() => {
    setStatus('new')
    setGuesses([])
    setCurrent(newGuess)
  }, [setGuesses, setStatus, setCurrent])

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

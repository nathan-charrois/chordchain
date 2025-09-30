import { useEffect, useMemo } from 'react'
import { Card, Group } from '@mantine/core'

import GameKeyboardButton from './GameKeyboardButton'
import { useGame } from './hooks/useGame'

const keys = [
  '0', '1', '2', '3', '4',
  '5', '6', '7', '8', '9',
]

const operations = [
  '+', '-', '*',
  '/', '(', ')',
]

export default function GameKeyboard() {
  const {
    setGuess,
    guesses,
    deleteGuess,
    submitGuess,
  } = useGame()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ([...keys, ...operations].includes(e.key)) {
        setGuess(e.key)
      }
      else if (e.key === 'Enter') {
        submitGuess()
      }
      else if (e.key === 'Backspace') {
        deleteGuess()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setGuess, submitGuess, deleteGuess])

  const numberRow = useMemo(() => (
    keys.map((character) => {
      return (
        <GameKeyboardButton
          key={character}
          character={character}
          guesses={guesses}
          onClick={() => setGuess(character)}
        />
      )
    })
  ), [setGuess, guesses])

  const operationsRow = useMemo(() => (
    operations.map((character) => {
      return (
        <GameKeyboardButton
          key={character}
          character={character}
          guesses={guesses}
          onClick={() => setGuess(character)}
        />
      )
    })
  ), [setGuess, guesses])

  return (
    <Card>
      <Group grow mb="md">{numberRow}</Group>
      <Group grow>
        <GameKeyboardButton
          character="Enter"
          guesses={[]}
          onClick={submitGuess}
        />
        {operationsRow}
        <GameKeyboardButton
          character="Undo"
          guesses={[]}
          onClick={deleteGuess}
        />
      </Group>
    </Card>
  )
}

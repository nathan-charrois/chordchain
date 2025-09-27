import { useEffect, useMemo } from 'react'
import { Button, Card, Group } from '@mantine/core'

import { useGame } from './hooks/useGame'
import { getCellStatus, getStatusBackgroundColor, getStatusTextColor } from './logic/game'

const keys = [
  '0', '1', '2', '3',
  '4', '5', '6', '7',
  '8', '9', '+', '-',
  '*', '/', '(', ')',
]

export default function GameKeyboard() {
  const {
    setGuess,
    guesses,
    deleteGuess,
    submitGuess,
    resetGame,
  } = useGame()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      if (keys.includes(e.key)) {
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
  }, [setGuess, submitGuess, deleteGuess, resetGame])

  const numberRow = useMemo(() => (
    keys.map((value) => {
      const status = getCellStatus(value, guesses)
      const bg = getStatusBackgroundColor(status)
      const color = getStatusTextColor(status)

      return (
        <Button
          key={value}
          onClick={() => setGuess(value)}
          bg={bg}
          color={color}
          w={60}
        >
          {value}
        </Button>
      )
    })
  ), [setGuess, guesses])

  return (
    <Card bg="gray.1">
      <Group mb="md">{numberRow}</Group>
      <Group grow>
        <Button onClick={submitGuess}>Enter</Button>
        <Button onClick={deleteGuess}>Delete</Button>
        <Button onClick={resetGame}>Reset</Button>
      </Group>
    </Card>
  )
}

import { useMemo } from 'react'
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
  const { setGuess, guesses, deleteGuess, submitGuess, status, resetGame } = useGame()

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
        >
          {value}
        </Button>
      )
    })
  ), [setGuess, guesses])

  if (status === 'won') {
    return (
      <Card bg="indigo.1">
        <Button onClick={resetGame}>Play Again</Button>
      </Card>
    )
  }

  return (
    <Card bg="gray.1">
      <Group mb="md">{numberRow}</Group>
      <Group grow>
        <Button onClick={submitGuess}>Enter</Button>
        <Button onClick={deleteGuess}>Delete</Button>
      </Group>
    </Card>
  )
}

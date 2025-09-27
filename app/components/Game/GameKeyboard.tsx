import { useMemo } from 'react'
import { Button, Card, Group } from '@mantine/core'

import { useGame } from './hooks/useGame'
import { getCellStatus } from './logic/game'

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const operations = ['+', '-', '*', '/', '(', ')']

export default function GameKeyboard() {
  const { setGuess, guesses, deleteGuess, submitGuess } = useGame()

  const numberRow = useMemo(() => (
    [...numbers, ...operations].map((value) => {
      const status = getCellStatus(value, guesses)
      const bg = status === 'correct' ? 'green.6' : status === 'present' ? 'yellow.6' : ''
      const color = status === 'correct' ? 'white' : status === 'present' ? 'white' : ''

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

  return (
    <Card mb="md" bg="gray.1">
      <Group mb="md">{numberRow}</Group>
      <Group grow>
        <Button onClick={submitGuess}>Enter</Button>
        <Button onClick={deleteGuess}>Delete</Button>
      </Group>
    </Card>
  )
}

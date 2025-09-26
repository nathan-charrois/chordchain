import { useMemo } from 'react'
import { Button, Card, Group } from '@mantine/core'

import { useGame } from './hooks/useGame'

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const operations = ['+', '-', '*', '/', '(', ')']

export default function GameKeyboard() {
  const { setGuess, deleteGuess, submitGuess } = useGame()

  const numberRow = useMemo(() => (
    [...numbers, ...operations].map(value => (
      <Button
        key={value}
        onClick={() => setGuess(value)}
      >
        {value}
      </Button>
    ))
  ), [setGuess])

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

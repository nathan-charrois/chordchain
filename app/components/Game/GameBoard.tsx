import { useMemo } from 'react'
import { Card, Stack } from '@mantine/core'

import GameRow from './GameRow'
import { useGame } from './hooks/useGame'

export default function GameBoard() {
  const { maxGuesses, status } = useGame()

  const rows = useMemo(() => (
    [...Array(maxGuesses).keys()].map(i => (
      <Stack key={i}>
        <GameRow rowIndex={i} />
      </Stack>
    ))
  ), [maxGuesses])

  if (status === 'won') {
    return (
      <Card mb="md" bg="indigo.1">
        You won!
      </Card>
    )
  }

  return (
    <Card mb="md" bg="indigo.1">
      {rows}
    </Card>
  )
}

import { useMemo } from 'react'
import { Card, Stack } from '@mantine/core'

import GameRow from './GameRow'
import { useGame } from './hooks/useGame'
import { isGameRowActive } from './logic/game'

export default function GameBoard() {
  const { maxGuesses, status, guesses } = useGame()

  const rows = useMemo(() => (
    [...Array(maxGuesses).keys()].map((index) => {
      const isActive = isGameRowActive(guesses, status, index)

      return (
        <Stack key={index}>
          <GameRow rowIndex={index} isActive={isActive} />
        </Stack>
      )
    })
  ), [maxGuesses, status, guesses])

  return (
    <Card bdrs="md">
      <Stack gap="md">
        {rows}
      </Stack>
    </Card>
  )
}

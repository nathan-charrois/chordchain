import { useMemo } from 'react'
import { Stack } from '@mantine/core'

import GameRow from './GameRow'
import { useGame } from './hooks/useGame'

export default function GameBoard() {
  const { maxGuesses } = useGame()

  const rows = useMemo(() => (
    [...Array(maxGuesses).keys()].map(i => (
      <Stack key={i}>
        <GameRow rowIndex={i} />
      </Stack>
    ))
  ), [maxGuesses])

  return rows
}

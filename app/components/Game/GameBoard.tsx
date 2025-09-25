import { useMemo } from 'react'
import { Stack } from '@mantine/core'

import { useGame } from './GameProvider'
import GameRow from './GameRow'

export default function GameBoard() {
  const { maxGuesses } = useGame()

  const rows = useMemo(() => (
    [...Array(maxGuesses).keys()].map(key => (
      <Stack>
        <GameRow key={key} />
      </Stack>
    ))
  ), [maxGuesses])

  return rows
}

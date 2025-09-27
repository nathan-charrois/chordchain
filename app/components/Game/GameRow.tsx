import { useMemo } from 'react'
import { Group } from '@mantine/core'

import GameCell from './GameCell'
import { useGame } from './hooks/useGame'

type Props = {
  rowIndex: number
}

export default function GameRow({ rowIndex }: Props) {
  const { maxCharacters, guess, guesses } = useGame()

  const cells = useMemo(() => {
    return [...Array(maxCharacters).keys()].map((i) => {
      const isActiveRow = rowIndex === guesses.length
      const character = guesses[rowIndex]?.guess[i] ?? guess[i]
      const status = guesses[rowIndex]?.status[i] ?? null

      return (
        <GameCell
          key={i}
          isActiveRow={isActiveRow}
          character={character}
          status={status}
        />
      )
    })
  }, [maxCharacters, guess])

  return (
    <Group grow gap="sm" mb="sm">
      {cells}
    </Group>
  )
}

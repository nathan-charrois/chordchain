import { useMemo } from 'react'
import { Group } from '@mantine/core'

import GameCell from './GameCell'
import { useGame } from './hooks/useGame'

type Props = {
  rowIndex: number
}

export default function GameRow({ rowIndex }: Props) {
  const { maxCharacters, guess, guesses, status } = useGame()

  const isActiveRow = useMemo(() =>
    status === 'won'
      ? rowIndex === guesses.length - 1
      : rowIndex === guesses.length,
  [status, rowIndex, guesses.length])

  const cells = useMemo(() => {
    return [...Array(maxCharacters).keys()].map((i) => {
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
  }, [maxCharacters, guess, guesses, isActiveRow])

  return (
    <Group grow gap="sm" mb="sm">
      {cells}
    </Group>
  )
}

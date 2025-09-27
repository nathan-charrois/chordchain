import { useEffect, useMemo } from 'react'
import { Group } from '@mantine/core'

import GameCell from './GameCell'
import { useGame } from './hooks/useGame'
import { useAnimation } from '~/hooks/useAnimation'

type Props = {
  rowIndex: number
}

export default function GameRow({ rowIndex }: Props) {
  const { maxCharacters, guess, guesses, status, events } = useGame()

  const { ref, animate } = useAnimation({
    className: 'animate-headShake',
  })

  useEffect(() => {
    events.subscribe((event) => {
      if (event === 'INVALID_GUESS') {
        animate()
      }
    })
  }, [events, animate])

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
    <Group grow gap="sm" mb="sm" ref={isActiveRow ? ref : undefined}>
      {cells}
    </Group>
  )
}

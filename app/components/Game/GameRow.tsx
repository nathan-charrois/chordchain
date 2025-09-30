import { useEffect, useMemo } from 'react'
import { Group } from '@mantine/core'

import GameCell from './GameCell'
import { useGame } from './hooks/useGame'
import { useAnimation } from '~/hooks/useAnimation'

type Props = {
  rowIndex: number
  isActive: boolean
}

export default function GameRow({ rowIndex, isActive }: Props) {
  const { maxCharacters, guess, guesses, events } = useGame()
  const { ref, animate } = useAnimation({ className: 'animate-headShake', isActive })

  useEffect(() => {
    events.subscribe(({ event }) => {
      if (event === 'INVALID_GUESS') {
        animate()
      }
    })
  }, [events, animate])

  const cells = useMemo(() => {
    return [...Array(maxCharacters).keys()].map((i) => {
      const char = guesses[rowIndex]?.guess[i] ?? guess[i]
      const status = guesses[rowIndex]?.status[i] ?? null
      const character = isActive || status ? char : ''

      return (
        <GameCell
          key={i}
          isActive={isActive}
          character={character}
          status={status}
        />
      )
    })
  }, [maxCharacters, guess, guesses, isActive])

  return (
    <Group grow gap="md" ref={ref}>
      {cells}
    </Group>
  )
}

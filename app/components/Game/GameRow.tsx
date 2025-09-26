import { useMemo } from 'react'
import { Box, Group } from '@mantine/core'

import { useGame } from './hooks/useGame'
import { GAME_MAX_CHARS } from '~/constant'

type Props = {
  rowIndex: number
}

export default function GameRow({ rowIndex }: Props) {
  const { guess, guesses } = useGame()

  const cells = useMemo(() => {
    return [...Array(GAME_MAX_CHARS).keys()].map((i) => {
      if (guesses[rowIndex]) {
        return (
          <Box key={i} bg="gray">
            {`[ ${guesses[rowIndex][i]} ]`}
          </Box>
        )
      }

      const current = rowIndex === guesses.length
      const ch = guess[i] && current ? guess[i] : 'x'
      return (
        <Box key={i} bg={current ? 'blue' : ''}>
          {`[ ${ch} ]`}
        </Box>
      )
    })
  }, [guess])

  return <Group>{cells}</Group>
}

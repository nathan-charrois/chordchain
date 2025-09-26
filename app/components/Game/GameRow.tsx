import { useMemo } from 'react'
import { Box, Group } from '@mantine/core'

import { useGame } from './hooks/useGame'

type Props = {
  rowIndex: number
}

export default function GameRow({ rowIndex }: Props) {
  const { maxCharacters, guess, guesses } = useGame()

  const cells = useMemo(() => {
    return [...Array(maxCharacters).keys()].map((i) => {
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
  }, [maxCharacters, guess])

  return <Group>{cells}</Group>
}

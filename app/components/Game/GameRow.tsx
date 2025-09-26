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
          <Box key={i} bg="indigo.2" c="gray.6" mb="sm" py="sm" ta="center">
            {guesses[rowIndex][i]}
          </Box>
        )
      }

      const currentRow = rowIndex === guesses.length
      const currentChar = guess[i] && currentRow

      const ch = currentChar ? guess[i] : '-'
      const bg = currentRow ? 'green.3' : 'indigo.2'
      const color = currentChar ? 'green.9' : 'indigo.2'

      return (
        <Box key={i} bg={bg} c={color} mb="sm" py="sm" ta="center">
          {ch}
        </Box>
      )
    })
  }, [maxCharacters, guess])

  return <Group grow gap="sm">{cells}</Group>
}

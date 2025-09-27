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
      const guessedRow = guesses[rowIndex]
      if (guessedRow) {
        const status = guessedRow.status[i]
        const bg = status === 'correct' ? 'green.6' : status === 'present' ? 'yellow.6' : 'indigo.2'
        const color = status === 'correct' ? 'white' : status === 'present' ? 'white' : 'indigo.6'
        return (
          <Box key={i} bg={bg} c={color} mb="sm" py="sm" ta="center">
            {guessedRow.guess[i]}
          </Box>
        )
      }

      const currentRow = rowIndex === guesses.length
      const currentChar = guess[i] && currentRow

      const ch = currentChar ? guess[i] : '-'
      const bg = currentRow ? 'indigo.6' : 'indigo.2'
      const color = currentChar ? 'white' : currentRow ? 'indigo.6' : 'indigo.2'

      return (
        <Box key={i} bg={bg} c={color} mb="sm" py="sm" ta="center">
          {ch}
        </Box>
      )
    })
  }, [maxCharacters, guess])

  return <Group grow gap="sm">{cells}</Group>
}

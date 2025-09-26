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
      const isCurrentRow = rowIndex === guesses.length
      const ch = guess[i] && isCurrentRow ? guess[i] : 'x'

      return (
        <Box key={i}>
          {`[ ${ch} ]`}
        </Box>
      )
    })
  }, [guess])

  return <Group>{cells}</Group>
}

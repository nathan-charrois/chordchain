import { useMemo } from 'react'
import { Box, Group } from '@mantine/core'

export default function GameRow() {
  const cells = useMemo(() => (
    [...Array(8).keys()].map(key => (
      <Box key={key}>[ x ]</Box>
    ))
  ), [])

  return <Group>{cells}</Group>
}

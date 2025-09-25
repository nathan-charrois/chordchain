import { useMemo } from 'react'
import { Box, Group, Stack } from '@mantine/core'

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const operations = ['+', '-', '*', '/', '(', ')']
const buttons = ['Enter', 'Delete']

export default function GameKeyboard() {
  const numberRow = useMemo(() => (
    numbers.map(value => (
      <Box key={value}>{value}</Box>
    ))
  ), [numbers])

  const buttonRow = useMemo(() => (
    [...operations, ...buttons].map(value => (
      <Box key={value}>{value}</Box>
    ))
  ), [operations, buttons])

  return (
    <Stack>
      <Group>{numberRow}</Group>
      <Group>{buttonRow}</Group>
    </Stack>
  )
}

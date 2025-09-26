import { useMemo } from 'react'
import { Button, Group, Stack } from '@mantine/core'

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const operations = ['+', '-', '*', '/', '(', ')']

const buttons = ['Enter', 'Delete']

export default function GameKeyboard() {
  const numberRow = useMemo(() => (
    [...numbers, ...operations].map(value => (
      <Button key={value}>{value}</Button>
    ))
  ), [numbers])

  const buttonRow = useMemo(() => (
    buttons.map(value => (
      <Button key={value}>{value}</Button>
    ))
  ), [operations, buttons])

  return (
    <Stack>
      <Group>{numberRow}</Group>
      <Group>{buttonRow}</Group>
    </Stack>
  )
}

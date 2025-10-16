import { Card, Stack } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'

export default function Board() {
  const { maxGuesses } = useGame()
  console.log(maxGuesses)

  return (
    <Card bdrs="md" bg="transparent">
      <Stack gap="md">
        Controls
        {maxGuesses}
        Guesses
      </Stack>
    </Card>
  )
}

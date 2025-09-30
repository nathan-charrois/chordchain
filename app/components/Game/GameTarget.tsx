import { Card, Text } from '@mantine/core'

import { useGame } from './hooks/useGame'

export default function GameTarget() {
  const { target, status, guesses, maxGuesses } = useGame()

  return (
    <Card c="white">
      <Text>{`Game status: ${status}`}</Text>
      <Text>{`Guess: ${guesses.length + 1} of ${maxGuesses}`}</Text>
      <Text>{`Find the hidden calculation that equals ${target}`}</Text>
    </Card>
  )
}

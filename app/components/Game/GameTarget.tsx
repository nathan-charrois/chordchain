import { Card, Text } from '@mantine/core'

import { useGame } from './hooks/useGame'

export default function GameTarget() {
  const { status, target } = useGame()

  if (status === 'won') {
    return (
      <Card c="white">
        <Text size="lg">
          {`You win! You found the hidden calculation that equals ${target}.`}
        </Text>
      </Card>
    )
  }

  return (
    <Card c="white">
      <Text size="lg">
        Find the hidden calculation that equals:
        <Text span fw="bold">{` ${target}`}</Text>
      </Text>
    </Card>
  )
}

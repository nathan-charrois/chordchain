import { Button, Card, Stack } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'

export default function AppConnect() {
  const { restartGame } = useGame()

  return (
    <Card c="white">
      <Stack>
        <Button>Connect Wallet</Button>
        <Button onClick={restartGame}>Restart</Button>
      </Stack>
    </Card>
  )
}

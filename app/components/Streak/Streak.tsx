import { Stack, Text } from '@mantine/core'

import { useGame } from '~/components/Game/hooks/useGame'

export default function Streak() {
  const {
    currentStreak,
  } = useGame()

  return (
    <Stack gap={2}>
      <Text fw={700}>{currentStreak}</Text>
      <Text size="sm" c="dimmed">Day Streak</Text>
    </Stack>
  )
}

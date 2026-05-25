import { Stack, Text } from '@mantine/core'

type StreakProps = {
  value: number
}

export function Streak({ value }: StreakProps) {
  return (
    <Stack gap={2}>
      <Text fw={700}>{value}</Text>
      <Text size="sm" c="dimmed">Day Streak</Text>
    </Stack>
  )
}

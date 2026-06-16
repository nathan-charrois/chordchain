import { Group, Stack, Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'

export default function SidebarDetails() {
  const {
    activePuzzle,
  } = useGame()

  return (
    <Card withBorder>
      <Group justify="space-between" align="center" wrap="wrap">
        <Stack gap={2}>
          <Text>{`Puzzle Name: ${activePuzzle.name}`}</Text>
          <Text c="dimmed">{`Difficulty: ${activePuzzle.difficulty}`}</Text>
        </Stack>
      </Group>
    </Card>
  )
}

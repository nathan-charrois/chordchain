import { Fire02Icon } from '@hugeicons/core-free-icons'
import { Group, Stack, Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'

export default function SidebarStreak() {
  const { currentStreak } = useGame()

  return (
    <Card>
      <Group align="center" wrap="wrap">
        <Stack bg="blue.0" w={60} h={60} align="center" justify="center" bdrs="md">
          <Icon icon={Fire02Icon} onClick={() => { }} />
        </Stack>
        <Stack gap={4}>
          <Text size="sm">Current Streak</Text>
          <Text fw={500} size="md">{currentStreak}</Text>
        </Stack>
      </Group>
    </Card>

  )
}

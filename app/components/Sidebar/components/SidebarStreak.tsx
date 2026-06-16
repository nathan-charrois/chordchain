import { Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import { formatModeLabel } from '~/utils/music'

export default function SidebarStreak() {
  const { activePuzzle, currentStreak } = useGame()
  const keyLabel = activePuzzle.key
  const modeLabel = formatModeLabel(activePuzzle.mode)

  return (
    <Card withBorder>
      <Text>
        {`${keyLabel} ${modeLabel}`}
      </Text>
      <Text size="sm" c="dimmed">
        Current Streak:
        {' '}
        {currentStreak}
      </Text>
    </Card>
  )
}

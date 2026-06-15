import { Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { formatModeLabel } from '~/utils/music'

export default function Scale() {
  const { activePuzzle } = useGame()
  const keyLabel = activePuzzle.key
  const modeLabel = formatModeLabel(activePuzzle.mode)

  return (
    <Text>
      {`${keyLabel} ${modeLabel}`}
    </Text>
  )
}

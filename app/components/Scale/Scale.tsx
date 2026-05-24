import { Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { formatModeLabel } from '~/utils/music'

export default function Scale() {
  const { activePuzzle, hintProgress } = useGame()
  const keyLabel = hintProgress >= 1 ? activePuzzle.key : '?'
  const modeLabel = hintProgress >= 2 ? formatModeLabel(activePuzzle.mode) : '?'

  return (
    <Text>
      {`${keyLabel} ${modeLabel}`}
    </Text>
  )
}

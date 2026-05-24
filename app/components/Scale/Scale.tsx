import { Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getPuzzleScaleLabel } from '~/utils/dailyPuzzle'

export default function Scale() {
  const { activePuzzle } = useGame()
  const scaleLabel = getPuzzleScaleLabel(activePuzzle)

  return (
    <Text>
      {scaleLabel}
    </Text>
  )
}

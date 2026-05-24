import { Card, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getPuzzleScaleLabel } from '~/utils/dailyPuzzle'
import classes from './Scale.module.css'

export default function Scale() {
  const { activePuzzle } = useGame()
  const scaleLabel = getPuzzleScaleLabel(activePuzzle)

  return (
    <Card
      className={classes.card}
      m="lg"
      py="xs"
      px="xl"
      ta="center"
      w={460}
    >
      <Text className={classes.text}>{scaleLabel}</Text>
    </Card>
  )
}

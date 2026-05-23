import { Card, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import classes from './Scale.module.css'

export default function Scale() {
  const { activePuzzle } = useGame()
  const scaleLabel = `${activePuzzle.key ?? 'C'} ${activePuzzle.mode ?? 'Ionian'}`.toUpperCase()

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

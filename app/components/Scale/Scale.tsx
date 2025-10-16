import { Card, Text } from '@mantine/core'

import classes from './Scale.module.css'

export default function Scale() {
  return (
    <Card
      className={classes.card}
      m="lg"
      py="xs"
      px="xl"
      bdrs="lg"
    >
      <Text className={classes.text}>C MAJOR, IONION</Text>
    </Card>
  )
}

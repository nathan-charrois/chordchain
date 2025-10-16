import { Card, Text } from '@mantine/core'

import classes from './Pallete.module.css'

export default function Pallete() {
  return (
    <Card className={classes.card} m="lg" bdrs="lg" ta="center">
      <Text className={classes.text}>CHORD PALETTE</Text>
    </Card>
  )
}

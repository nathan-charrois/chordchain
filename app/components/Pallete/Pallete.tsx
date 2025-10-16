import { Card, Group, Stack, Text } from '@mantine/core'

import PalleteButton from '../PalleteButton/PalleteButton'
import classes from './Pallete.module.css'

export default function Pallete() {
  return (
    <Card className={classes.card} m="lg" bdrs="lg" ta="center">
      <Stack>
        <Text className={classes.text}>CHORD PALETTE</Text>
        <Group grow>
          <PalleteButton character="C" />
          <PalleteButton character="Dm" />
          <PalleteButton character="Em" />
          <PalleteButton character="F" />
          <PalleteButton character="G" />
        </Group>
        <Group>
          <PalleteButton character="Am" />
          <PalleteButton character="Bdim" />
          <PalleteButton character="Undo" />
          <PalleteButton character="Enter" />
        </Group>
      </Stack>
    </Card>
  )
}

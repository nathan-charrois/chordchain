import { Card, Group, Stack } from '@mantine/core'

import PalleteButton from '../PalleteButton/PalleteButton'
import classes from './Pallete.module.css'

export default function Pallete() {
  return (
    <Card className={classes.card} m="lg" p="lg" bdrs="lg" ta="center">
      <Stack>
        <Group grow gap="lg" mb="md">
          <PalleteButton character="C" />
          <PalleteButton character="Dm" />
          <PalleteButton character="Em" />
          <PalleteButton character="F" />
          <PalleteButton character="G" />
        </Group>
        <Group grow gap="lg" mb="md">
          <PalleteButton character="Del" />
          <Group grow ml="lg" mr="lg" gap="lg">
            <PalleteButton character="Am" />
            <PalleteButton character="Bdim" />
          </Group>
          <PalleteButton character="Enter" />
        </Group>
      </Stack>
    </Card>
  )
}

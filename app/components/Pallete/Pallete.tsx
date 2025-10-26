import { Card, Group, Stack } from '@mantine/core'

import PalleteButton from '../PalleteButton/PalleteButton'
import classes from './Pallete.module.css'

export default function Pallete() {
  return (
    <Card className={classes.card} m="lg" p="lg" bdrs="lg" ta="center">
      <Stack>
        <Group grow gap="lg" mb="md">
          <PalleteButton text="C" />
          <PalleteButton text="Dm" />
          <PalleteButton text="Em" />
          <PalleteButton text="F" />
          <PalleteButton text="G" />
        </Group>
        <Group grow gap="lg" mb="md">
          <PalleteButton variant="secondary" text="Undo" />
          <Group grow gap="lg">
            <PalleteButton text="Am" />
            <PalleteButton text="Bdim" />
          </Group>
          <PalleteButton variant="secondary" text="Enter" />
        </Group>
      </Stack>
    </Card>
  )
}

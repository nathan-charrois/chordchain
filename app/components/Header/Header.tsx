import { Grid, Group } from '@mantine/core'

import History from '~/components/History/History'
import HowToPlay from '~/components/HowToPlay/HowToPlay'

export default function Header() {
  return (
    <Grid align="center" my="md">
      <Grid.Col span={7}>
        <img src="/images/logo.png" alt="ChordChain Logo" />
      </Grid.Col>
      <Grid.Col span={5}>
        <Group justify="flex-end">
          <History />
          <HowToPlay />
        </Group>
      </Grid.Col>
    </Grid>
  )
}

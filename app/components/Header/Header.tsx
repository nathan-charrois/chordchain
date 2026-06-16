import { Grid, Group } from '@mantine/core'

import About from '~/components/About/About'
import Card from '~/components/Card/Card'
import History from '~/components/History/History'

export default function Header() {
  return (
    <Grid align="center" my="md">
      <Grid.Col span={7}>
        <img src="/images/logo.png" alt="ChordChain Logo" />
      </Grid.Col>
      <Grid.Col span={5}>
        <Group justify="flex-end">
          <Card>
            <History />
          </Card>
          <Card>
            <About />
          </Card>
        </Group>
      </Grid.Col>
    </Grid>
  )
}

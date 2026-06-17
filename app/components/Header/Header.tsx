import { Grid, Group, Title } from '@mantine/core'

import About from '~/components/About/About'
import Card from '~/components/Card/Card'
import History from '~/components/History/History'

export default function Header() {
  return (
    <Grid align="center" my="md" py="xl">
      <Grid.Col span={7}>
        <Title order={1} fw={600} lh={1.4}>
          ChordChain
        </Title>
        <Title order={2} size="h4" fw={600} c="blue.9" opacity={0.6}>
          Daily Chord Progression Puzzles
        </Title>
      </Grid.Col>
      <Grid.Col span={5}>
        <Group justify="flex-end">
          <Card w={100}>
            <History />
          </Card>
          <Card w={100}>
            <About />
          </Card>
        </Group>
      </Grid.Col>
    </Grid>
  )
}

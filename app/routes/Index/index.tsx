import type { MetaArgs } from 'react-router'
import { Grid, Text } from '@mantine/core'

import AppLayout from '~/components/App/AppLayout'
import AppProvider from '~/components/App/AppProvider'
import Header from '~/components/Header/Header'

export function meta({}: MetaArgs) {
  return [
    { title: 'Mathler - Index' },
  ]
}

export default function Index() {
  return (
    <AppProvider>
      <AppLayout header={<Header />}>
        <Grid>
          <Grid.Col span={8}>
            <Text>Find the hidden calculation that equals 22</Text>
            <Text>Gameboard</Text>
            <Text>Keyboard</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text>Achievements</Text>
          </Grid.Col>
        </Grid>
      </AppLayout>
    </AppProvider>
  )
}

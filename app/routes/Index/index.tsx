import type { MetaArgs } from 'react-router'
import { Card, Grid, Text } from '@mantine/core'

import AppLayout from '~/components/App/AppLayout'
import AppProvider from '~/components/App/AppProvider'
import GameBoard from '~/components/Game/GameBoard'
import GameKeyboard from '~/components/Game/GameKeyboard'
import GameTarget from '~/components/Game/GameTarget'
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
            <GameTarget />
            <GameBoard />
            <GameKeyboard />
          </Grid.Col>
          <Grid.Col span={4}>
            <Card mb="md" bg="gray.1">
              <Text>Achievements</Text>
            </Card>
          </Grid.Col>
        </Grid>
      </AppLayout>
    </AppProvider>
  )
}

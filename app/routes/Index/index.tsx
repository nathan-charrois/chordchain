import type { MetaArgs } from 'react-router'
import { Grid } from '@mantine/core'

import Achievements from '~/components/Achievements/Achievements'
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
          <Grid.Col span={9}>
            <GameTarget />
            <GameBoard />
            <GameKeyboard />
          </Grid.Col>
          <Grid.Col span={3}>
            <Achievements />
          </Grid.Col>
        </Grid>
      </AppLayout>
    </AppProvider>
  )
}

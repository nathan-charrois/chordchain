import type { MetaArgs } from 'react-router'
import { Grid, Stack } from '@mantine/core'

import Achievements from '~/components/Achievements/Achievements'
import AppConnect from '~/components/App/AppConnect'
import AppLayout from '~/components/App/AppLayout'
import AppProvider from '~/components/App/AppProvider'
import GameBoard from '~/components/Game/GameBoard'
import GameKeyboard from '~/components/Game/GameKeyboard'
import GameTarget from '~/components/Game/GameTarget'
import Header from '~/components/Header/Header'
import { useIsTablet } from '~/hooks/useIsTablet'

export function meta({}: MetaArgs) {
  return [
    { title: 'Mathler - Index' },
  ]
}

export default function Index() {
  const isTablet = useIsTablet()

  return (
    <AppProvider>
      <AppLayout header={<Header />}>
        <Grid gutter="xl" miw={isTablet ? '90vw' : '900px'}>
          <Grid.Col span={isTablet ? 12 : 9}>
            <Stack gap="xl">
              <GameTarget />
              <GameBoard />
              <GameKeyboard />
            </Stack>
          </Grid.Col>
          <Grid.Col span={isTablet ? 12 : 3}>
            <Stack gap="xl">
              <AppConnect />
              <Achievements />
            </Stack>
          </Grid.Col>
        </Grid>
      </AppLayout>
    </AppProvider>
  )
}

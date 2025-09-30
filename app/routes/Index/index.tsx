import type { MetaArgs } from 'react-router'
import { Anchor, Grid, Stack, Text } from '@mantine/core'

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
        <Grid gutter="xl" w={isTablet ? '90vw' : '900px'}>
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
          <Grid.Col span={12}>
            <Text size="md" ta="center" c="white">
              <Anchor pl="xs" href="https://nathansoftware.ca" target="_blank" c="white">
                Nathan Software © 2025
              </Anchor>
            </Text>
          </Grid.Col>
        </Grid>
      </AppLayout>
    </AppProvider>
  )
}

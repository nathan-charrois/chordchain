import type { MetaArgs } from 'react-router'
import { Group, Stack, Text } from '@mantine/core'

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
        <Group>
          <Stack>
            <Text>Find the hidden calculation that equals 22</Text>
            <Text>Gameboard</Text>
            <Text>Keyboard</Text>
          </Stack>
          <Stack>
            <Text>Achievements</Text>
            <Text>Leaderboard</Text>
            <Text>Settings</Text>
          </Stack>
        </Group>
      </AppLayout>
    </AppProvider>
  )
}

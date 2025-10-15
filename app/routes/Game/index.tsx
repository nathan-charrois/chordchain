import type { MetaArgs } from 'react-router'
import { Stack, Text } from '@mantine/core'

import AppLayout from '~/components/App/AppLayout'
import AppProvider from '~/components/App/AppProvider'

export function meta({ }: MetaArgs) {
  return [
    { title: 'ChordChain - Guess the progression!' },
  ]
}

export default function Game() {
  return (
    <AppProvider>
      <AppLayout>
        <Stack>
          <Text>Scale</Text>
          <Text>Board</Text>
          <Text>-- Controls</Text>
          <Text>-- Guesses</Text>
          <Text>Pallete</Text>
        </Stack>
      </AppLayout>
    </AppProvider>
  )
}

import { type MetaArgs, useParams } from 'react-router'
import { Stack } from '@mantine/core'

import AppLayout from '~/components/App/AppLayout'
import AppProvider from '~/components/App/AppProvider'
import Board from '~/components/Board/Board'
import DebugPanel from '~/components/DebugPanel/DebugPanel'
import Pallete from '~/components/Pallete/Pallete'
import Scale from '~/components/Scale/Scale'

export function meta({ }: MetaArgs) {
  return [
    { title: 'ChordChain - Guess the progression!' },
  ]
}

export default function Game() {
  const { puzzleSlug } = useParams()

  return (
    <AppProvider puzzleSlug={puzzleSlug}>
      <AppLayout>
        <DebugPanel />
        <Stack align="center">
          <Scale />
          <Board />
          <Pallete />
        </Stack>
      </AppLayout>
    </AppProvider>
  )
}

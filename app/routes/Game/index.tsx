import { type MetaArgs, useParams } from 'react-router'
import { Grid } from '@mantine/core'

import AppLayout from '~/components/App/AppLayout'
import AppProvider from '~/components/App/AppProvider'
import Board from '~/components/Board/Board'
import Pallete from '~/components/Pallete/Pallete'
import Sidebar from '~/components/Sidebar/Sidebar'

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
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Sidebar />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Board />
            <Pallete />
          </Grid.Col>
        </Grid>
      </AppLayout>
    </AppProvider>
  )
}

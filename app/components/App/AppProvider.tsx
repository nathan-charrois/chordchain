import { MantineProvider } from '@mantine/core'

import { SequenceProvider } from '../Board/context/SequenceContext'
import { GameProvider } from '../Game/GameProvider'
import theme from '~/utils/theme'

type Props = {
  children: React.ReactNode
  puzzleSlug?: string
}

export default function AppProvider({ children, puzzleSlug }: Props) {
  return (
    <MantineProvider theme={theme}>
      <GameProvider routePuzzleSlug={puzzleSlug}>
        <SequenceProvider>
          {children}
        </SequenceProvider>
      </GameProvider>
    </MantineProvider>
  )
}

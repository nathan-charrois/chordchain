import { MantineProvider } from '@mantine/core'

import { GameProvider } from '../Game/GameProvider'
import theme from '~/utils/theme'

type Props = {
  children: React.ReactNode
}

export default function AppProvider({ children }: Props) {
  return (
    <MantineProvider theme={theme}>
      <GameProvider>
        {children}
      </GameProvider>
    </MantineProvider>
  )
}

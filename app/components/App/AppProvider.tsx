import { MantineProvider } from '@mantine/core'

import { GameProvider } from '~/components/Game/GameProvider'

type Props = {
  children: React.ReactNode
}

export default function AppProvider({ children }: Props) {
  return (
    <MantineProvider>
      <GameProvider>
        {children}
      </GameProvider>
    </MantineProvider>
  )
}

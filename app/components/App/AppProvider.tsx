import { MantineProvider } from '@mantine/core'

import { AchievementsProvider } from '../Achievements/AchievementsProvider'
import { GameProvider } from '~/components/Game/GameProvider'
import theme from '~/utils/theme'

type Props = {
  children: React.ReactNode
}

export default function AppProvider({ children }: Props) {
  return (
    <MantineProvider theme={theme}>
      <GameProvider>
        <AchievementsProvider>
          {children}
        </AchievementsProvider>
      </GameProvider>
    </MantineProvider>
  )
}

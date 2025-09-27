import { MantineProvider } from '@mantine/core'

import { AchievementsProvider } from '../Achievements/AchievementsProvider'
import { GameProvider } from '~/components/Game/GameProvider'

type Props = {
  children: React.ReactNode
}

export default function AppProvider({ children }: Props) {
  return (
    <MantineProvider>
      <GameProvider>
        <AchievementsProvider>
          {children}
        </AchievementsProvider>
      </GameProvider>
    </MantineProvider>
  )
}

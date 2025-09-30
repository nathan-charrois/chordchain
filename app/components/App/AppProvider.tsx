import { createTheme, MantineProvider } from '@mantine/core'

import { AchievementsProvider } from '../Achievements/AchievementsProvider'
import { GameProvider } from '~/components/Game/GameProvider'

type Props = {
  children: React.ReactNode
}

const theme = createTheme({
  components: {
    AppShell: {
      styles: () => ({
        header: {
          background: '#9AB8C1',
        },
      }),
    },
    Card: {
      styles: () => ({
        root: {
          background: `linear-gradient(
            180deg,
            #45525A 75%,
            #3D4952 100%
          )`,
          border: '1px solid #2C363E',
          boxShadow: `
            0 0 0 0px #343D46,
            0 1px 0 1px #6F7B82,
            0 0 0 9px #586772,
            0 -1px 0 9px #96A7AB,
            0 0 0 10px #263137
          `,
        },
      }),
    },
  },
})

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

import { createTheme, MantineProvider } from '@mantine/core'

import { AchievementsProvider } from '../Achievements/AchievementsProvider'
import { GameProvider } from '~/components/Game/GameProvider'

type Props = {
  children: React.ReactNode
}

// const theme = createTheme({
//   components: {
//     Box: {
//       styles: (theme: MantineTheme, props: ButtonProps) => {
//         if (props.variant === 'test') {
//           return {
//             root: {},
//           }
//         }
//         return {
//           root: 'box-background',
//         }
//       },
//     },
//   },
// })

const theme = createTheme({
  components: {},
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

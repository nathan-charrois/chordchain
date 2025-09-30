import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { MantineProvider } from '@mantine/core'

import { AchievementsProvider } from '../Achievements/AchievementsProvider'
import { GameProvider } from '~/components/Game/GameProvider'
import theme from '~/utils/theme'

const settings = {
  environmentId: import.meta.env.VITE_DYNAMIC_ENV_ID,
  walletConnectors: [EthereumWalletConnectors],
}

type Props = {
  children: React.ReactNode
}

export default function AppProvider({ children }: Props) {
  return (
    <DynamicContextProvider settings={settings}>
      <MantineProvider theme={theme}>
        <GameProvider>
          <AchievementsProvider>
            {children}
          </AchievementsProvider>
        </GameProvider>
      </MantineProvider>
    </DynamicContextProvider>
  )
}

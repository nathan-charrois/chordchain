import { useCallback, useMemo } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { Box, Button, Card, Group, Indicator, Stack, Text } from '@mantine/core'

export default function AppConnect() {
  const {
    setShowAuthFlow,
    primaryWallet,
    handleLogOut,
    loadingNetwork,
  } = useDynamicContext()

  const handleConnectWallet = useCallback(() => {
    setShowAuthFlow(true)
  }, [setShowAuthFlow])

  const title = useMemo(() =>
    loadingNetwork ? 'Connecting...' : 'Connected',
  [loadingNetwork])

  const color = useMemo(() =>
    loadingNetwork ? 'yellow' : 'green',
  [loadingNetwork])

  const walletName = useMemo(() =>
    primaryWallet && primaryWallet.address.slice(0, 14) + '...',
  [primaryWallet])

  if (primaryWallet) {
    return (
      <Card c="white">
        <Stack>
          <Group>
            <Text>{title}</Text>
            <Indicator processing color={color} />
          </Group>
          <Box w="100%" ta="center" p="xs" className="achievement">
            {walletName}
          </Box>
          <Button onClick={handleLogOut} className="button-disconnect">
            Disconnect Wallet
          </Button>
        </Stack>
      </Card>
    )
  }

  return (
    <Card>
      <Button onClick={handleConnectWallet} className="button-connect">
        Connect Wallet
      </Button>
    </Card>
  )
}

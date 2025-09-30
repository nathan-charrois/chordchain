import { useCallback } from 'react'
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

  if (primaryWallet) {
    const walletName = primaryWallet.address.slice(0, 14) + '...'
    const color = loadingNetwork ? 'yellow' : 'green'

    return (
      <Card c="white">
        <Stack>
          <Group>
            <Text>Connected</Text>
            <Indicator processing color={color} />
          </Group>
          <Box w="100%" ta="center" p="xs" className="achievement">
            {walletName}
          </Box>
          <Button onClick={handleLogOut}>Disconnect Wallet</Button>
        </Stack>
      </Card>
    )
  }

  return (
    <Card>
      <Button onClick={handleConnectWallet}>Connect Wallet</Button>
    </Card>
  )
}

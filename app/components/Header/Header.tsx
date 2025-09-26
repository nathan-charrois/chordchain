import { Button, Grid, Title } from '@mantine/core'

export default function Header() {
  return (
    <Grid bg="gray.1" p="sm" px="xl" align="center">
      <Grid.Col span={8}>
        <Title>Mathler</Title>
      </Grid.Col>
      <Grid.Col span={4} ta="right">
        <Button>
          Connect Wallet
        </Button>
      </Grid.Col>
    </Grid>
  )
}

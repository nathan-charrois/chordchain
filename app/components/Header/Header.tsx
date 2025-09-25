import { Grid, Text, Title } from '@mantine/core'

export default function Header() {
  return (
    <Grid>
      <Grid.Col span={8}>
        <Title>Mathler</Title>
      </Grid.Col>
      <Grid.Col span={4}>
        <Text>Connect Wallet</Text>
      </Grid.Col>
    </Grid>

  )
}

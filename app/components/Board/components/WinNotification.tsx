import { Divider, Stack, Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { responsiveSizing } from '~/constant'

type Props = {
  attemptsUsed: number
}

export default function WinNotification({ attemptsUsed }: Props) {
  const attemptLabel = attemptsUsed === 1 ? 'attempt' : 'attempts'

  return (
    <Card mb={responsiveSizing}>
      <Stack gap="sm" ta="center" align="center">
        <Divider m="xl" />
        <Text fw={500} size="xl" c="brand.8">Puzzle Solved!</Text>
        <Text fw={400} c="dimmed">{`Solved in ${attemptsUsed} ${attemptLabel}`}</Text>
        <Divider m="xl" />
      </Stack>
    </Card>
  )
}

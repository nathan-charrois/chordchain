import { Badge, Card, Divider, Group, Stack, Text } from '@mantine/core'

import { responsiveSizing } from '~/constant'
import type { DisplayChord } from '~/utils/music'
import { chordIdKey } from '~/utils/music'

type Props = {
  answer: DisplayChord[]
}

export default function LossNotification({ answer }: Props) {
  return (
    <Card mb={responsiveSizing} shadow="sm">
      <Stack gap="sm" ta="center" align="center">
        <Divider m="xl" />
        <Text fw={500} size="xl" c="brand.8">Game End</Text>
        <Divider m="sm" />
        <Text fw={400} c="dimmed">Today's chords</Text>
        <Group gap="sm" wrap="wrap" py="sm">
          {answer.map((chord, index) => (
            <Badge
              key={`${chordIdKey(chord)}-${index}`}
              color="forest.7"
              variant="filled"
              size="xl"
              miw={64}
              fw={500}
              bdrs="sm"
              py="lg"
            >
              {chord.name}
            </Badge>
          ))}
        </Group>
        <Divider m="xl" />
      </Stack>
    </Card>
  )
}

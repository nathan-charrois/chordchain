import { useMemo } from 'react'
import { FullSignalIcon, LowSignalIcon, MediumSignalIcon, MusicNote02Icon, PuzzleIcon } from '@hugeicons/core-free-icons'
import { Divider, Group, Stack, Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import { formatModeLabel } from '~/utils/music'

export default function SidebarDetails() {
  const {
    activePuzzle,
  } = useGame()

  const keyLabel = activePuzzle.key
  const modeLabel = formatModeLabel(activePuzzle.mode)

  const difficultyIcon = useMemo(() => {
    if (activePuzzle.difficulty === 'Easy') {
      return LowSignalIcon
    }

    if (activePuzzle.difficulty === 'Medium') {
      return MediumSignalIcon
    }

    return FullSignalIcon
  }, [activePuzzle.difficulty])

  const difficultyTextColor = useMemo(() => {
    if (activePuzzle.difficulty === 'Hard') {
      return 'orange.9'
    }

    if (activePuzzle.difficulty === 'Medium') {
      return 'orange.5'
    }

    return 'green.9'
  }, [activePuzzle.difficulty])

  return (
    <>
      <Card>
        <Stack>
          <Group align="center" wrap="wrap">
            <Stack bg="blue.0" w={60} h={60} align="center" justify="center" bdrs="md">
              <Icon icon={PuzzleIcon} onClick={() => { }} />
            </Stack>
            <Stack gap={2}>
              <Text size="sm">Puzzle</Text>
              <Text fw={500} size="md">{activePuzzle.name}</Text>
            </Stack>
          </Group>
        </Stack>
        <Divider my="lg" variant="dashed" />
        <Stack>
          <Group align="center" wrap="wrap">
            <Stack bg="blue.0" w={60} h={60} align="center" justify="center" bdrs="md">
              <Icon icon={difficultyIcon} onClick={() => { }} />
            </Stack>
            <Stack gap={2}>
              <Text size="sm">Difficulty</Text>
              <Text fw={500} size="md" c={difficultyTextColor}>{activePuzzle.difficulty}</Text>
            </Stack>
          </Group>
        </Stack>
        <Divider my="lg" variant="dashed" />
        <Group align="center" wrap="wrap">
          <Stack bg="blue.0" w={60} h={60} align="center" justify="center" bdrs="md">
            <Icon icon={MusicNote02Icon} onClick={() => { }} />
          </Stack>
          <Stack gap={4}>
            <Text size="sm">Key & Mode</Text>
            <Text fw={500} size="md">{`${keyLabel} ${modeLabel}`}</Text>
          </Stack>
        </Group>
      </Card>
    </>
  )
}

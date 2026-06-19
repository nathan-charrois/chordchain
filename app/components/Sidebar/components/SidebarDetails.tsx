import { useMemo } from 'react'
import { FullSignalIcon, LowSignalIcon, MediumSignalIcon, MusicNote02Icon, PuzzleIcon } from '@hugeicons/core-free-icons'
import { Divider, Group, Stack, Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import { buildScale, formatModeLabel, formatPuzzleDifficulty } from '~/utils/music'

export default function SidebarDetails() {
  const {
    activePuzzle,
  } = useGame()

  const keyLabel = activePuzzle.key
  const modeLabel = formatModeLabel(activePuzzle.mode)
  const difficultyLabel = formatPuzzleDifficulty(activePuzzle.difficulty)
  const scale = useMemo(
    () => buildScale(activePuzzle.key, activePuzzle.mode),
    [activePuzzle.key, activePuzzle.mode],
  )

  const difficultyIcon = useMemo(() => {
    if (activePuzzle.difficulty === 'easy') {
      return LowSignalIcon
    }

    if (activePuzzle.difficulty === 'medium') {
      return MediumSignalIcon
    }

    return FullSignalIcon
  }, [activePuzzle.difficulty])

  const difficultyTextColor = useMemo(() => {
    if (activePuzzle.difficulty === 'hard') {
      return 'orange.9'
    }

    if (activePuzzle.difficulty === 'medium') {
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
              <Text size="sm">Puzzle Name</Text>
              <Text fw={500} size="md">{activePuzzle.name}</Text>
            </Stack>
          </Group>
        </Stack>
        <Divider my="md" variant="dashed" />
        <Group align="center" justify="space-between" mb="lg">
          <Stack gap={2}>
            <Text size="sm">Difficulty</Text>
            <Text fw={500} size="md" c={difficultyTextColor}>{difficultyLabel}</Text>
          </Stack>
          <Icon icon={difficultyIcon} onClick={() => { }} />
        </Group>
        <Group align="center" justify="space-between">
          <Stack gap={4}>
            <Text size="sm">Key / Mode</Text>
            <Text fw={500} size="md">{`${keyLabel} ${modeLabel}`}</Text>
            <Text size="sm" c="dimmed">{scale.join(', ')}</Text>
          </Stack>
          <Icon icon={MusicNote02Icon} onClick={() => { }} />
        </Group>
      </Card>
    </>
  )
}

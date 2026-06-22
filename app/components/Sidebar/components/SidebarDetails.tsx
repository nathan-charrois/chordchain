import { useMemo } from 'react'
import { FullSignalIcon, LowSignalIcon, MediumSignalIcon, MusicNote02Icon, PuzzleIcon } from '@hugeicons/core-free-icons'
import { Group, Stack, Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import { formatModeLabel, formatPuzzleDifficulty } from '~/utils/music'

export default function SidebarDetails() {
  const {
    activePuzzle,
  } = useGame()

  const keyLabel = activePuzzle.key
  const modeLabel = formatModeLabel(activePuzzle.mode)
  const difficultyLabel = formatPuzzleDifficulty(activePuzzle.difficulty)

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
      return 'amber.9'
    }

    if (activePuzzle.difficulty === 'medium') {
      return 'amber.5'
    }

    return 'forest.7'
  }, [activePuzzle.difficulty])

  return (
    <>
      <Card>
        <Group align="center" justify="space-between" mb="lg">
          <Stack gap={2}>
            <Text size="sm">Puzzle</Text>
            <Text fw={500} size="md">{activePuzzle.name}</Text>
          </Stack>
          <Icon icon={PuzzleIcon} color="dark.8" />
        </Group>
        <Group align="center" justify="space-between" mb="lg">
          <Stack gap={2}>
            <Text size="sm">Difficulty</Text>
            <Text fw={500} size="md" c={difficultyTextColor}>{difficultyLabel}</Text>
          </Stack>
          <Icon icon={difficultyIcon} color="dark.8" />
        </Group>
        <Group align="center" justify="space-between">
          <Stack gap={2}>
            <Text size="sm">Key / Mode</Text>
            <Text fw={500} size="md">{`${keyLabel} ${modeLabel}`}</Text>
          </Stack>
          <Icon icon={MusicNote02Icon} color="dark.8" />
        </Group>
      </Card>
    </>
  )
}

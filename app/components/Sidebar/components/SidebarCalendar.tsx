import { useEffect, useState } from 'react'
import { ArrowRight01Icon, Calendar03Icon, CheckmarkCircle04Icon, Fire02Icon, PuzzleFreeIcons } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Divider, Group, Stack, Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import { getPuzzleNumberLabel } from '~/utils/dailyPuzzle'
import { formatCountdown, formatDisplayDate, getSecondsToNextMidnight } from '~/utils/date'

export default function SidebarCalendar() {
  const {
    activePuzzle,
    currentStreak,
    status,
  } = useGame()

  const [secondsUntilReset, setSecondsUntilReset] = useState(() =>
    getSecondsToNextMidnight(new Date()),
  )

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsUntilReset(getSecondsToNextMidnight(new Date()))
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <Card>
      <Text fz="md" fw={500} mb="sm">Today's Puzzle</Text>
      <Group align="center" wrap="nowrap">
        <Stack bg="blue.0" w={60} h={60} align="center" justify="center" bdrs="md">
          <Icon icon={Calendar03Icon} onClick={() => { }} />
        </Stack>
        <Stack gap={2}>
          <Text fw={500} size="md">{formatDisplayDate(activePuzzle.date)}</Text>
          <Text size="sm">{getPuzzleNumberLabel(activePuzzle)}</Text>
        </Stack>
        <Stack align="center" flex={1} c="gray.5">
          <HugeiconsIcon width={20} icon={ArrowRight01Icon} aria-label="Open puzzle modal" />
        </Stack>
      </Group>
      <Divider my="md" variant="dashed" />
      <Group align="center" justify="space-between" mb="lg">
        <Stack gap={2}>
          <Text size="sm">Status</Text>
          <Text fw={500} size="md" tt="capitalize">{status}</Text>
        </Stack>
        <Icon icon={CheckmarkCircle04Icon} onClick={() => { }} />
      </Group>
      <Group align="center" justify="space-between" mb="lg">
        <Stack gap={2}>
          <Text size="sm">Streak</Text>
          <Text fw={500} size="md">{`${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`}</Text>
        </Stack>
        <Icon icon={Fire02Icon} onClick={() => { }} />
      </Group>
      <Group align="center" justify="space-between">
        <Stack gap={2}>
          <Text size="sm">Next Puzzle</Text>
          <Text fw={500} size="md">{formatCountdown(secondsUntilReset)}</Text>
        </Stack>
        <Icon icon={PuzzleFreeIcons} onClick={() => { }} />
      </Group>
    </Card>
  )
}

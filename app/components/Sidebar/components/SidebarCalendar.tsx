import { useCallback, useEffect, useState } from 'react'
import { ArrowRight01Icon, Calendar03Icon, CheckmarkCircle04Icon, Fire02Icon, PuzzleFreeIcons } from '@hugeicons/core-free-icons'
import { Button, Divider, Group, Stack, Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import PuzzleCalendarModal from '~/components/Sidebar/components/PuzzleCalendarModal'
import { getPuzzleNumberLabel } from '~/utils/dailyPuzzle'
import { formatCountdown, formatDisplayDate, getSecondsToNextMidnight } from '~/utils/date'

export default function SidebarCalendar() {
  const [isPuzzleModalOpen, setIsPuzzleModalOpen] = useState(false)
  const {
    activePuzzle,
    currentStreak,
    status,
  } = useGame()

  const handleClickTodaysPuzzle = useCallback(() => {
    setIsPuzzleModalOpen(true)
  }, [])

  const handleClosePuzzleModal = useCallback(() => {
    setIsPuzzleModalOpen(false)
  }, [])

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
    <>
      <Card>
        <Text fz="md" fw={500} mb="sm">Today's Puzzle</Text>
        <Button variant="transparent" p={0} onClick={handleClickTodaysPuzzle} h={60} justify="flex-start" fullWidth c="dark" display="block">
          <Group align="center" wrap="nowrap" gap="sm" justify="space-between">
            <Stack bg="gray.2" c="dark.5" w={60} h={60} align="center" justify="center" bdrs="md">
              <Icon icon={Calendar03Icon} size="28" />
            </Stack>
            <Stack gap={2} ta="left" mr="md">
              <Text fw={500} size="md">{formatDisplayDate(activePuzzle.date)}</Text>
              <Text size="sm">{getPuzzleNumberLabel(activePuzzle)}</Text>
            </Stack>
            <Stack c="dimmed">
              <Icon icon={ArrowRight01Icon} size={20} />
            </Stack>
          </Group>
        </Button>
        <Divider my="md" variant="dashed" />
        <Group align="center" justify="space-between" mb="lg">
          <Stack gap={2}>
            <Text size="sm">Status</Text>
            <Text fw={500} size="md" tt="capitalize">{status}</Text>
          </Stack>
          <Icon icon={CheckmarkCircle04Icon} />
        </Group>
        <Group align="center" justify="space-between" mb="lg">
          <Stack gap={2}>
            <Text size="sm">Streak</Text>
            <Text fw={500} size="md">{`${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`}</Text>
          </Stack>
          <Icon icon={Fire02Icon} />
        </Group>
        <Group align="center" justify="space-between">
          <Stack gap={2}>
            <Text size="sm">Next Puzzle</Text>
            <Text fw={500} size="md">{formatCountdown(secondsUntilReset)}</Text>
          </Stack>
          <Icon icon={PuzzleFreeIcons} />
        </Group>
      </Card>
      <PuzzleCalendarModal
        opened={isPuzzleModalOpen}
        onClose={handleClosePuzzleModal}
      />
    </>
  )
}

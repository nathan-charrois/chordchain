import { useCallback, useEffect, useState } from 'react'
import { ArrowRight01Icon, Calendar03Icon, Fire02Icon, HourglassIcon, Tick02Icon } from '@hugeicons/core-free-icons'
import { Divider, Group, Stack, Text, UnstyledButton } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import PuzzleCalendarModal from '~/components/Sidebar/components/PuzzleCalendarModal'
import { useIsTablet } from '~/hooks/useIsTablet'
import { getPuzzleNumberLabel } from '~/utils/dailyPuzzle'
import { formatCountdown, formatDisplayDate, getSecondsToNextMidnight } from '~/utils/date'

export default function SidebarCalendar() {
  const [isPuzzleModalOpen, setIsPuzzleModalOpen] = useState(false)
  const isTablet = useIsTablet()
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
        {!isTablet && <Text fz="md" fw={500} mb="sm">Today's Puzzle</Text>}
        <UnstyledButton onClick={handleClickTodaysPuzzle} c="dark">
          <Group align="center">
            <Stack
              bg="gray.3"
              c="brand.8"
              w={isTablet ? 48 : 60}
              h={isTablet ? 48 : 60}
              align="center"
              justify="center"
              bdrs="md"
            >
              <Icon icon={Calendar03Icon} size={isTablet ? 22 : 30} />
            </Stack>
            <Stack gap={2} ta="left" flex={1}>
              <Text fw={500} fz="md" lh={1.2}>{formatDisplayDate(activePuzzle.date)}</Text>
              <Text fz="sm" lh={1.2}>{getPuzzleNumberLabel(activePuzzle)}</Text>
            </Stack>
            <Stack c="dimmed">
              <Icon icon={ArrowRight01Icon} size={isTablet ? 24 : 20} />
            </Stack>
          </Group>
        </UnstyledButton>
        {!isTablet && (
          <>
            <Divider my="md" variant="dashed" />
            <Group align="center" wrap="nowrap" gap="md" mb="lg">
              <Stack gap={0} miw={0} flex={1}>
                <Text fz="sm">Status</Text>
                <Text fw={500} fz="md" lh={1.2} tt="capitalize">{status}</Text>
              </Stack>
              <Icon icon={Tick02Icon} color="forest.6" />
            </Group>
            <Group align="center" wrap="nowrap" gap="md" mb="lg">
              <Stack gap={0} miw={0} flex={1}>
                <Text fz="sm">Streak</Text>
                <Text fw={500} fz="md" lh={1.2}>{`${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`}</Text>
              </Stack>
              <Icon icon={Fire02Icon} color="amber.6" />
            </Group>
            <Group align="center" wrap="nowrap" gap="md">
              <Stack gap={0} miw={0} flex={1}>
                <Text fz="sm">Next Puzzle</Text>
                <Text fw={500} fz="md" lh={1.2}>{formatCountdown(secondsUntilReset)}</Text>
              </Stack>
              <Icon icon={HourglassIcon} color="dark.8" />
            </Group>
          </>
        )}
      </Card>
      <PuzzleCalendarModal
        opened={isPuzzleModalOpen}
        onClose={handleClosePuzzleModal}
      />
    </>
  )
}

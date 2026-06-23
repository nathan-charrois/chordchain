import { useCallback, useEffect, useState } from 'react'
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CircleIcon,
  Clock01Icon,
  Fire02Icon,
  HourglassIcon,
  MultiplicationSignCircleIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import { Divider, Group, Stack, Text, UnstyledButton } from '@mantine/core'

import Card from '~/components/Card/Card'
import type { GameStatus } from '~/components/Game/context/GameContext'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import PuzzleCalendarModal from '~/components/Sidebar/components/PuzzleCalendarModal'
import { useIsTablet } from '~/hooks/useIsTablet'
import { getPuzzleNumberLabel } from '~/utils/dailyPuzzle'
import { formatCountdown, formatDisplayDate, getSecondsToNextMidnight } from '~/utils/date'

const statusDetails: Record<GameStatus, {
  color: string
  icon: IconSvgElement
  label: string
}> = {
  new: {
    color: 'gray.6',
    icon: CircleIcon,
    label: 'Not started',
  },
  started: {
    color: 'amber.7',
    icon: Clock01Icon,
    label: 'In progress',
  },
  won: {
    color: 'forest.6',
    icon: Tick02Icon,
    label: 'Win',
  },
  loss: {
    color: 'red.6',
    icon: MultiplicationSignCircleIcon,
    label: 'Loss',
  },
}

export default function SidebarCalendar() {
  const [isPuzzleModalOpen, setIsPuzzleModalOpen] = useState(false)
  const isTablet = useIsTablet()
  const {
    activePuzzle,
    currentStreak,
    status,
  } = useGame()
  const statusDetail = statusDetails[status]

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
                <Text fw={500} fz="md" lh={1.2}>{statusDetail.label}</Text>
              </Stack>
              <Icon icon={statusDetail.icon} color={statusDetail.color} />
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

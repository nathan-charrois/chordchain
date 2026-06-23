import { useCallback, useMemo, useState } from 'react'
import { Basketball01Icon, Clock01Icon, Fire02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge, Group, Indicator, Modal, Stack, Text, Timeline } from '@mantine/core'

import Card from '../Card/Card'
import { getSubmittedCellColor } from '../Game/logic/game'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import { useIsMobile } from '~/hooks/useIsMobile'
import { resolveDailyPuzzle } from '~/utils/dailyPuzzle'
import { formatDisplayDateTime } from '~/utils/date'

export default function History() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()
  const { currentStreak, puzzleDates, historyEntries } = useGame()

  const handleOnClick = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleOnClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const historyItems = useMemo(() => {
    return Object.keys(historyEntries)
      .reverse()
      .map((date) => {
        const entry = historyEntries[date]
        const puzzle = resolveDailyPuzzle(date)

        const isCompleted = entry.completed === true
        const isFailed = entry.failed === true

        const statusLabel = isFailed ? 'Loss' : isCompleted ? 'Win' : ''
        const statusColor = isFailed ? 'red.7' : isCompleted ? 'green.7' : 'gray.5'
        const attemptsUsed = entry.attemptsUsed ?? entry.guesses?.length
        const statusDateTime = entry.completedAt ?? entry.failedAt
        console.log(entry)

        return (
          <Card shadow="sm">
            <Group gap="xs" justify="space-between" mb="sm">
              <Text fw={500}>{puzzle.name}</Text>
              {statusLabel && <Badge color={statusColor} variant="outline">{statusLabel}</Badge>}
            </Group>
            <Group gap="xs">
              {typeof attemptsUsed === 'number' && (
                <Group>
                  <Indicator position="middle-center" inline color={getSubmittedCellColor('absent')} size={12} />
                  {`${attemptsUsed} ${attemptsUsed === 1 ? 'attempt' : 'attempts'}`}
                </Group>
              )}
            </Group>
            {statusDateTime && (
              <Text size="sm" c="dimmed">
                {`${isCompleted ? 'Won on' : 'Lost on'} ${formatDisplayDateTime(statusDateTime)}`}
              </Text>
            )}
          </Card>
        )
      })
  }, [historyEntries, puzzleDates])

  const modalBody = useMemo(() => {
    const streakSection = (
      <Group grow>
        <Card shadow="sm">
          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="sm" c="dimmed">Streak</Text>
              <Text fw={600} size="lg">
                {`${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`}
              </Text>
            </Stack>
            <HugeiconsIcon icon={Fire02Icon} aria-label="Current streak" />
          </Group>
        </Card>
        <Card withBorder shadow="sm">
          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="sm" c="dimmed">Played</Text>
              <Text fw={600} size="lg">
                {`${historyItems.length} ${currentStreak === 1 ? 'game' : 'games'}`}
              </Text>
            </Stack>
            <HugeiconsIcon icon={Basketball01Icon} aria-label="Games Played" />
          </Group>
        </Card>
      </Group>

    )

    if (historyItems.length) {
      return (
        <Stack>
          {streakSection}
          <Text size="md">Previous Games</Text>
          {historyItems}
        </Stack>
      )
    }

    return <Text c="dimmed">No games played yet.</Text>
  }, [historyItems])

  return (
    <>
      <Icon label="History" icon={Clock01Icon} onClick={handleOnClick} compact={isMobile} />
      <Modal
        opened={isOpen}
        onClose={handleOnClose}
        size="md"
        title="History"
        closeOnEscape
        centered
      >
        {modalBody}
      </Modal>
    </>
  )
}

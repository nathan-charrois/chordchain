import { useCallback, useMemo, useState } from 'react'
import { CancelCircleIcon, CheckmarkCircle04Icon, Clock01Icon, PlayCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge, Group, Modal, Stack, Text, Timeline } from '@mantine/core'

import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import { resolveDailyPuzzle } from '~/utils/dailyPuzzle'
import { formatDisplayDateTime } from '~/utils/date'
import { formatPuzzleDifficulty } from '~/utils/music'

export default function History() {
  const [isOpen, setIsOpen] = useState(false)
  const { puzzleDates, historyEntries } = useGame()

  const handleOnClick = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleOnClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const historyItems = useMemo(() => {
    return puzzleDates
      .filter(date => historyEntries[date])
      .map((date) => {
        const entry = historyEntries[date]
        const puzzle = resolveDailyPuzzle(date)
        const isCompleted = entry.completed === true
        const isFailed = entry.failed === true
        const statusLabel = isFailed ? 'Loss' : isCompleted ? 'Win' : 'In progress'
        const statusColor = isFailed ? 'red' : isCompleted ? 'green' : 'blue'
        const statusIcon = isFailed
          ? CancelCircleIcon
          : isCompleted
            ? CheckmarkCircle04Icon
            : PlayCircleIcon
        const attemptsUsed = entry.attemptsUsed ?? entry.guesses?.length
        const statusDateTime = entry.completedAt ?? entry.failedAt

        return (
          <Timeline.Item
            key={date}
            color={statusColor}
            bullet={<HugeiconsIcon icon={statusIcon} width={16} />}
            title={(
              <Group gap="xs" justify="space-between">
                <Text fw={700}>{puzzle.name}</Text>
                <Badge color={statusColor} variant="light">{statusLabel}</Badge>
              </Group>
            )}
          >
            <Stack gap={4}>
              <Group gap="xs">
                <Badge color="gray.6" variant="outline">
                  {formatPuzzleDifficulty(puzzle.difficulty)}
                </Badge>
                {typeof attemptsUsed === 'number' && (
                  <Text size="sm" c="dimmed">
                    {`${attemptsUsed} ${attemptsUsed === 1 ? 'attempt' : 'attempts'}`}
                  </Text>
                )}
              </Group>
              {statusDateTime && (
                <Text size="sm" c="dimmed">
                  {`${isCompleted ? 'Completed' : 'Failed'} ${formatDisplayDateTime(statusDateTime)}`}
                </Text>
              )}
            </Stack>
          </Timeline.Item>
        )
      })
  }, [historyEntries, puzzleDates])

  const modalBody = useMemo(() => {
    if (historyItems.length) {
      return (
        <Timeline active={historyItems.length - 1} bulletSize={28} lineWidth={2}>
          {historyItems}
        </Timeline>
      )
    }

    return <Text c="dimmed">No games played yet.</Text>
  }, [historyItems])

  return (
    <>
      <Icon label="History" icon={Clock01Icon} onClick={handleOnClick} />
      <Modal
        opened={isOpen}
        onClose={handleOnClose}
        title="Game History"
        closeOnEscape
        centered
      >
        {modalBody}
      </Modal>
    </>
  )
}

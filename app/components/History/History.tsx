import { useCallback, useMemo, useState } from 'react'
import { Cancel01Icon, Clock01Icon, PlayIcon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge, Group, Modal, Stack, Text, Timeline } from '@mantine/core'

import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import { resolveDailyPuzzle } from '~/utils/dailyPuzzle'
import { formatDisplayDateTime } from '~/utils/date'

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
    return Object.keys(historyEntries)
      .reverse()
      .map((date) => {
        const entry = historyEntries[date]
        const puzzle = resolveDailyPuzzle(date)
        const isCompleted = entry.completed === true
        const isFailed = entry.failed === true
        const statusLabel = isFailed ? 'Loss' : isCompleted ? 'Win' : ''
        const statusColor = isFailed ? 'red.7' : isCompleted ? 'green.7' : 'gray.5'
        const statusIcon = isFailed ? Cancel01Icon : isCompleted ? Tick02Icon : PlayIcon
        const attemptsUsed = entry.attemptsUsed ?? entry.guesses?.length
        const statusDateTime = entry.completedAt ?? entry.failedAt

        return (
          <Timeline.Item
            key={date}
            color={statusColor}
            bullet={<HugeiconsIcon icon={statusIcon} width={16} />}
            title={(
              <Group gap="xs" justify="space-between">
                <Text fw={500}>{puzzle.name}</Text>
                {statusLabel && <Badge color={statusColor} variant="outline">{statusLabel}</Badge>}
              </Group>
            )}
          >
            <Stack gap={2}>
              <Group gap="xs">
                {typeof attemptsUsed === 'number' && (
                  <Text size="sm" c="dimmed">
                    {`${attemptsUsed} ${attemptsUsed === 1 ? 'attempt' : 'attempts'}`}
                  </Text>
                )}
              </Group>
              {statusDateTime && (
                <Text size="sm" c="dimmed">
                  {`${isCompleted ? 'Won on' : 'Lost on'} ${formatDisplayDateTime(statusDateTime)}`}
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
        <Timeline active={historyItems.length - 1} bulletSize={28} lineWidth={1}>
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

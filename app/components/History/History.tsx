import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Clock01Icon } from '@hugeicons/core-free-icons'
import { Badge, Button, Group, Modal, Stack, Text } from '@mantine/core'

import { useSequence } from '~/components/Board/hooks/useSequence'
import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
import { getPuzzlePathForDate, resolveDailyPuzzle } from '~/utils/dailyPuzzle'
import { formatDisplayDate, formatDisplayDateTime } from '~/utils/date'

export default function History() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const { stop } = useSequence()

  const {
    todayDate,
    selectedPuzzleDate,
    puzzleDates,
    historyEntries,
    selectPuzzleDate,
  } = useGame()

  const handleOnClick = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleOnClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleSelect = useCallback((date: string) => {
    stop()
    navigate(getPuzzlePathForDate(date))
    selectPuzzleDate(date)
    setIsOpen(false)
  }, [stop, navigate, selectPuzzleDate])

  const historyRows = useMemo(() => {
    return puzzleDates.map((date) => {
      const entry = historyEntries[date]
      const puzzle = resolveDailyPuzzle(date)
      const completedAt = entry?.completedAt ? formatDisplayDateTime(entry.completedAt) : null
      const failedAt = entry?.failedAt ? formatDisplayDateTime(entry.failedAt) : null
      const isCompleted = entry?.completed === true
      const isFailed = entry?.failed === true
      const isSelected = date === selectedPuzzleDate
      const actionLabel = isSelected ? 'Viewing' : 'View'
      const statusLabel = isFailed ? 'Failed' : isCompleted ? 'Complete' : undefined
      const statusColor = isFailed ? 'red' : isCompleted ? 'green' : 'gray'

      return (
        <Card key={date} withBorder>
          <Stack gap="sm">
            <Stack gap={2}>
              <Group gap="xs" justify="space-between">
                <Text fw={700}>{puzzle.name}</Text>
                {date === todayDate && <Badge color="blue">Today's Puzzle</Badge>}
              </Group>
              <Text size="sm" c="dimmed">{formatDisplayDate(date)}</Text>
            </Stack>
            <Group gap="xs">
              <Badge color="gray.6" variant="outline">{puzzle.difficulty}</Badge>
              {statusLabel && (<Badge color={statusColor} variant="outline">{statusLabel}</Badge>)}

            </Group>
            {(entry?.completed || entry?.failed) && (
              <Stack gap={2}>
                {typeof entry.attemptsUsed === 'number' && (
                  <Text size="sm" c="dimmed">
                    {`Attempts used: ${entry.attemptsUsed}`}
                  </Text>
                )}
                {completedAt && (
                  <Text size="sm" c="dimmed">
                    {`Completed at: ${completedAt}`}
                  </Text>
                )}
                {failedAt && (
                  <Text size="sm" c="dimmed">
                    {`Failed at: ${failedAt}`}
                  </Text>
                )}
              </Stack>
            )}
            <Button
              size="xs"
              variant={isSelected ? 'light' : 'outline'}
              disabled={isSelected}
              onClick={() => handleSelect(date)}
            >
              {actionLabel}
            </Button>
          </Stack>
        </Card>
      )
    })
  }, [
    puzzleDates,
    historyEntries,
    todayDate,
    selectedPuzzleDate,
    handleSelect,
  ])

  return (
    <>
      <Icon label="History" icon={Clock01Icon} onClick={handleOnClick} />
      <Modal
        opened={isOpen}
        onClose={handleOnClose}
        title="History"
        closeOnEscape
        centered
      >
        <Stack>
          {historyRows}
        </Stack>
      </Modal>
    </>
  )
}

import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Badge, Button, Group, Modal, Stack, Text } from '@mantine/core'

import { useSequence } from '~/components/Board/hooks/useSequence'
import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import {
  getPuzzleNumberLabel,
  getPuzzlePathForDate,
  resolveDailyPuzzle,
} from '~/utils/dailyPuzzle'
import { formatDisplayDate } from '~/utils/date'
import { formatModeLabel, formatPuzzleDifficulty } from '~/utils/music'

type Props = {
  opened: boolean
  onClose: () => void
}

export default function PuzzleCalendarModal({ opened, onClose }: Props) {
  const navigate = useNavigate()
  const { stop } = useSequence()
  const {
    todayDate,
    selectedPuzzleDate,
    puzzleDates,
    historyEntries,
    selectPuzzleDate,
  } = useGame()

  const handleSelect = useCallback((date: string) => {
    stop()
    navigate(getPuzzlePathForDate(date))
    selectPuzzleDate(date)
    onClose()
  }, [navigate, onClose, selectPuzzleDate, stop])

  const puzzleRows = useMemo(() => {
    return puzzleDates.map((date) => {
      const entry = historyEntries[date]
      const puzzle = resolveDailyPuzzle(date)
      const isCompleted = entry?.completed === true
      const isFailed = entry?.failed === true
      const isSelected = date === selectedPuzzleDate
      const actionLabel = isSelected ? 'Playing' : 'Play'
      const statusLabel = isFailed
        ? 'Loss'
        : isCompleted
          ? 'Win'
          : ''
      const statusColor = isFailed
        ? 'dark.4'
        : isCompleted
          ? 'forest.5'
          : ''

      return (
        <Card key={date} shadow="sm">
          <Stack gap="sm">
            <Stack gap={2}>
              <Group gap="xs" justify="space-between" align="center" wrap="wrap">
                <Text fw={500} miw={0} flex={1}>
                  {puzzle.name}
                  {statusLabel && <Badge color={statusColor} variant="filled" ml="sm">{statusLabel}</Badge>}
                </Text>
                <Badge color="brand.7" variant="transparent">
                  {getPuzzleNumberLabel(puzzle)}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">{formatDisplayDate(date)}</Text>
            </Stack>
            <Group gap="xs">
              <Badge color="gray.6" variant="light">
                {`Key: ${puzzle.key}`}
              </Badge>
              <Badge color="gray.6" variant="light">
                {formatModeLabel(puzzle.mode)}
              </Badge>
              <Badge color="gray.6" variant="light">
                {formatPuzzleDifficulty(puzzle.difficulty)}
              </Badge>
            </Group>
            <Button
              size="md"
              variant={isSelected ? 'light' : 'default'}
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
    handleSelect,
    historyEntries,
    puzzleDates,
    selectedPuzzleDate,
    todayDate,
  ])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Daily Puzzles"
      size="md"
      closeOnEscape
      centered
    >
      <Stack>
        {puzzleRows}
      </Stack>
    </Modal>
  )
}

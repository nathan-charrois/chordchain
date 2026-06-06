import { useEffect, useState } from 'react'
import { Button, Group, Stack, Text } from '@mantine/core'

import { formatDisplayDate } from '~/utils/date'

type DailyPuzzleProps = {
  date: string
  isHistorical: boolean
  onOpenHistory: () => void
}

function getSecondsUntilNextLocalMidnight(now: Date): number {
  const nextMidnight = new Date(now)

  nextMidnight.setHours(24, 0, 0, 0)

  return Math.max(0, Math.floor((nextMidnight.getTime() - now.getTime()) / 1000))
}

function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function DailyPuzzle({ date, isHistorical, onOpenHistory }: DailyPuzzleProps) {
  const [secondsUntilReset, setSecondsUntilReset] = useState(() => getSecondsUntilNextLocalMidnight(new Date()))

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsUntilReset(getSecondsUntilNextLocalMidnight(new Date()))
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <Group justify="space-between" align="center" wrap="wrap">
      <Stack gap={2}>
        <Text fw={700}>{formatDisplayDate(date)}</Text>
        <Text size="sm">Daily Puzzle</Text>
        {isHistorical && <Text size="sm" c="blue.6">Playing previous puzzle</Text>}
        {!isHistorical && <Text size="sm" c="dimmed">{`Puzzle resets in ${formatCountdown(secondsUntilReset)}`}</Text>}
      </Stack>
      <Button variant="light" onClick={onOpenHistory}>Puzzle History</Button>
    </Group>
  )
}

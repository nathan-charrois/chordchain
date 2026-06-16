import { useEffect, useState } from 'react'
import { Group, Stack, Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import { formatCountdown, formatDisplayDate, getSecondsToNextMidnight } from '~/utils/date'

export default function SidebarCalendar() {
  const {
    activePuzzle,
    todayDate,
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
    <Card withBorder>
      <Group justify="space-between" align="center" wrap="wrap">
        <Stack gap={2}>
          <Text fw={700}>{formatDisplayDate(activePuzzle.date)}</Text>
          <Text size="sm">Daily Puzzle</Text>
          {activePuzzle.date !== todayDate
            ? (<Text size="sm" c="blue.6">Playing previous puzzle</Text>)
            : (<Text size="sm" c="dimmed">{`Puzzle resets in ${formatCountdown(secondsUntilReset)}`}</Text>)}
        </Stack>
      </Group>
    </Card>
  )
}

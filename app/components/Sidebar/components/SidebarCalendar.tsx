import { useEffect, useState } from 'react'
import { Calendar03Icon } from '@hugeicons/core-free-icons'
import { Divider, Group, Stack, Text } from '@mantine/core'

import Card from '~/components/Card/Card'
import { useGame } from '~/components/Game/hooks/useGame'
import Icon from '~/components/Icon/Icon'
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
    <Card>
      <Stack>
        <Group align="center" wrap="wrap">
          <Stack bg="blue.0" w={60} h={60} align="center" justify="center" bdrs="md">
            <Icon icon={Calendar03Icon} onClick={() => { }} />
          </Stack>
          <Stack gap={4}>
            <Text fw={500} size="md">{formatDisplayDate(activePuzzle.date)}</Text>
            <Text size="sm">Daily Puzzle</Text>
          </Stack>
        </Group>
        <Divider variant="dashed" />
        {activePuzzle.date !== todayDate
          ? (<Text c="dimmed">Playing previous puzzle</Text>)
          : (<Text c="dimmed">{`New puzzle in ${formatCountdown(secondsUntilReset)}`}</Text>)}
      </Stack>
    </Card>
  )
}

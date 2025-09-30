import { useCallback } from 'react'
import { Box, Card, Group } from '@mantine/core'

import { useAchievements } from './hooks/useAchievements'
import { allAchievements, firstGuessCorrect, lastGuessCorrect } from './logic/achievements'

export default function Achievements() {
  const { achievement } = useAchievements()

  const achievementClassName = useCallback(
    (key: string) => (
      achievement[key] ? 'achievement-won' : 'achievement-empty'
    ), [achievement])

  return (
    <Card c="white">
      <Group gap="sm" wrap="wrap">
        <Box w="100%" ta="center" fz="h2" p="md" className="achievement">
          <Box className={achievementClassName('firstGuessCorrect')}>{firstGuessCorrect['firstGuessCorrect']}</Box>
        </Box>
        <Box w="100%" ta="center" fz="h2" p="md" className="achievement">
          <Box className={achievementClassName('lastGuessCorrect')}>{lastGuessCorrect['lastGuessCorrect']}</Box>
        </Box>
        <Box w="100%" ta="center" fz="h2" p="md" className="achievement">
          <Box className={achievementClassName('allAchievements')}>{allAchievements['allAchievements']}</Box>
        </Box>
      </Group>
    </Card>
  )
}

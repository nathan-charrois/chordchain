import { Box, Card, Group } from '@mantine/core'

import { useAchievements } from './hooks/useAchievements'

export default function Achievements() {
  const { achievements } = useAchievements()

  console.log(achievements)
  return (
    <Card c="white">
      <Group gap="sm" wrap="wrap">
        <Box w="100%" ta="center" fz="h1" p="sm" className="achievement">
          <Box className="achievement-empty">🥇</Box>
        </Box>
        <Box w="100%" ta="center" fz="h1" p="sm" className="achievement">
          <Box className="achievement-empty">🥈</Box>
        </Box>
        <Box w="100%" ta="center" fz="h1" p="sm" className="achievement">
          <Box className="achievement-empty">🥉</Box>
        </Box>
        {achievements.map((achievement, index) => (
          <Box w="100%" ta="center" fz="h1" p="sm" key={index} className="achievement">
            <Box className="achievement-won">
              {`${achievement.emoji}`}
            </Box>
          </Box>
        ))}
      </Group>
    </Card>
  )
}

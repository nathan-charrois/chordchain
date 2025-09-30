import { Box, Card, Divider, Group, Text } from '@mantine/core'

import { useAchievements } from './hooks/useAchievements'

export default function Achievements() {
  const { achievements } = useAchievements()

  return (
    <Card c="white">
      <Text>Achievements</Text>
      <Divider my="sm" mb="lg" color="dark.1" />
      {achievements.length === 0 && (
        <Text>No achievements unlocked.</Text>
      )}
      <Group gap="sm" wrap="wrap">
        {achievements.map((achievement, index) => (
          <Box w="100%" ta="center" fz="h1" p="sm" key={index} className="achievement achievement-empty">
            {`${achievement.emoji}`}
          </Box>
        ))}
      </Group>
    </Card>
  )
}

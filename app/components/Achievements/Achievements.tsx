import { Card, Divider, Text } from '@mantine/core'

import { useAchievements } from './hooks/useAchievements'

export default function Achievements() {
  const { achievements } = useAchievements()

  return (
    <Card mb="md" bg="gray.1">
      <Text>Achievements</Text>
      <Divider my="xs" />
      {achievements.length === 0 && (
        <Text>No achievements unlocked.</Text>
      )}
      {achievements.map((achievement, index) => (
        <Text key={index} display="inline">
          {`${achievement.emoji} ${achievement.title} `}
        </Text>
      ))}
    </Card>
  )
}

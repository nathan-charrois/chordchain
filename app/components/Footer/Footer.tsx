import { Anchor, Text } from '@mantine/core'

const href = 'https://nathansoftware.ca'

export default function Footer() {
  return (
    <Text size="md" ta="center" c="white">
      <Anchor href={href} pl="xs" target="_blank" c="gray.4">
        Nathan Software © 2025
      </Anchor>
    </Text>
  )
}

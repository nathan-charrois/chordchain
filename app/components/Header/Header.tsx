import { Box, Flex, Title } from '@mantine/core'

import About from '~/components/About/About'
import Card from '~/components/Card/Card'
import History from '~/components/History/History'
import { useIsMobile } from '~/hooks/useIsMobile'

export default function Header() {
  const isMobile = useIsMobile()

  return (
    <Flex
      align="center"
      justify="space-between"
      wrap="nowrap"
      my={isMobile ? 'sm' : 'md'}
      py={isMobile ? 'sm' : 'lg'}
    >
      <Box>
        <Title order={1} fw={600} c="brand.8" fz="h2">
          ChordChain
        </Title>
        <Title order={2} fw={600} c="brand.6" fz="h4">
          Guess chords by listening
        </Title>
      </Box>
      <Flex justify="flex-end" gap="md">
        <Card p={0}>
          <History />
        </Card>
        <Card p={0}>
          <About />
        </Card>
      </Flex>
    </Flex>
  )
}

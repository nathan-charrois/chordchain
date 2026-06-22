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
      <Box miw={0} flex={1}>
        <Title order={1} fw={600} fz="h3">
          ChordChain
        </Title>
        <Title order={2} fw={600} c="blue.5" fz="h5">
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

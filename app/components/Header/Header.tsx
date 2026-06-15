import { HelpCircleIcon, Settings01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ActionIcon, Grid, Group } from '@mantine/core'

import History from '~/components/History/History'
import Streak from '~/components/Streak/Streak'

export default function Header() {
  return (
    <Grid overflow="hidden">
      <Grid.Col span={7}>
        <img src="/images/logo.png" alt="ChordChain Logo" />
      </Grid.Col>
      <Grid.Col span={5}>
        <Group>
          <Streak />
          <History />
          <ActionIcon variant="filled" size="xl" radius="xl" aria-label="How to Play">
            <HugeiconsIcon icon={HelpCircleIcon} />
          </ActionIcon>
          <ActionIcon variant="filled" size="xl" radius="xl" aria-label="Settings">
            <HugeiconsIcon icon={Settings01Icon} />
          </ActionIcon>
        </Group>
      </Grid.Col>
    </Grid>
  )
}

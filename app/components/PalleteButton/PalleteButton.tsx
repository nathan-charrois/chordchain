import { Box, Button, type ButtonVariant, Stack, Text } from '@mantine/core'

import Card from '../Card/Card'
import type { GuessStatus } from '../Game/context/GameContext'
import { getBadgeColor } from '../Game/logic/game'

type Props = {
  text: string
  subtext?: string
  variant?: ButtonVariant
  status?: GuessStatus
  disabled?: boolean
  onClick: () => void
  onMouseEnter?: () => void
  onFocus?: () => void
}

export default function PalleteButton({
  text,
  subtext,
  status,
  disabled,
  onClick,
  onMouseEnter,
  onFocus,
}: Props) {
  return (
    <Box
      flex={1}
      onMouseEnter={onMouseEnter}
    >
      <Card p={0} shadow="xs">
        <Button
          variant="subtle"
          size="lg"
          onClick={onClick}
          onFocus={onFocus}
          disabled={disabled}
          aria-disabled={disabled}
          h={80}
          p="md"
          bg={status === 'absent' ? 'gray.1' : status === 'correct' ? 'green.0' : status === 'present' ? 'orange.0' : undefined}
          fullWidth
        >
          <Stack gap={0}>
            <Text size="lg" c={getBadgeColor(status)}>
              {text}
            </Text>
            {subtext && (
              <Text size="sm" c="dimmed">
                {subtext}
              </Text>
            )}
          </Stack>
        </Button>
      </Card>
    </Box>
  )
}

import { useCallback, useMemo } from 'react'
import { Button, type ButtonVariant, Stack, Text } from '@mantine/core'

import Card from '../Card/Card'
import type { GuessStatus } from '../Game/context/GameContext'

type Props = {
  text: string
  subtext?: string
  variant?: ButtonVariant
  status?: GuessStatus
  disabled?: boolean
  onClick: (text: string) => void
}

export default function PalleteButton({
  text,
  subtext,
  status,
  disabled,
  onClick,
}: Props) {
  const statusPalette = useMemo(() => {
    switch (status) {
      case 'correct':
        return {
          textColor: '#2b8a3e',
        }
      case 'present':
        return {
          textColor: '#e67700',
        }
      case 'absent':
        return {
          textColor: '#495057',
        }
      default:
        return {
          textColor: undefined,
        }
    }
  }, [status])

  const handleOnClick = useCallback((text: string) => {
    onClick(text)
  }, [onClick])

  return (
    <Card p={0} shadow="xs">
      <Button
        variant="subtle"
        size="lg"
        onClick={() => handleOnClick(text)}
        disabled={disabled}
        aria-disabled={disabled}
        h={80}
      >
        <Stack gap={0}>
          <Text size="xl" c={!!disabled ? undefined : statusPalette.textColor}>
            {text}
          </Text>
          {subtext && (
            <Text size="sm" c="dimmed">
              iv
            </Text>
          )}
        </Stack>
      </Button>
    </Card>
  )
}

import { useCallback, useMemo } from 'react'
import { Button, type ButtonVariant, Text } from '@mantine/core'

import type { GuessStatus } from '../Game/context/GameContext'

type Props = {
  text: string
  variant?: ButtonVariant
  status?: GuessStatus
  disabled?: boolean
  onClick: (text: string) => void
}

export default function PalleteButton({
  text,
  variant,
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
  }, [status, variant])

  const handleOnClick = useCallback((text: string) => {
    onClick(text)
  }, [onClick])

  const buttonStyle = useMemo(() => ({
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
  }), [disabled])

  return (
    <Button
      variant={variant}
      size="xl"
      style={buttonStyle}
      onClick={() => handleOnClick(text)}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <Text c={statusPalette.textColor}>
        {text}
      </Text>
    </Button>
  )
}

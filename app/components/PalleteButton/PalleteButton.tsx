import { useCallback, useMemo } from 'react'
import { Button, Text } from '@mantine/core'

import type { GuessStatus } from '../Game/context/GameContext'

type Props = {
  text: string
  variant?: 'primary' | 'secondary'
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
  const palette = useMemo(() => {
    if (variant === 'secondary') {
      return {
        textColor: '#495057',
      }
    }

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
          textColor: '#343a40',
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
      variant="default"
      size="xl"
      style={buttonStyle}
      onClick={() => handleOnClick(text)}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <Text c={palette.textColor}>
        {text}
      </Text>
    </Button>
  )
}

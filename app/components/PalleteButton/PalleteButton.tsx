import { useCallback, useMemo } from 'react'
import { Box, Center, Text } from '@mantine/core'

import type { GuessStatus } from '../Game/context/GameContext'
import classes from './PalleteButton.module.css'

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
  const variantClassName = useMemo(() => (
    variant === 'secondary' ? classes.secondary : classes.primary
  ), [variant])

  const statusClassName = useMemo(() => {
    if (variant === 'secondary') {
      return ''
    }

    switch (status) {
      case 'correct':
        return classes.correct
      case 'present':
        return classes.present
      case 'absent':
        return classes.absent
      default:
        return ''
    }
  }, [status, variant])

  const handleOnClick = useCallback((text: string) => {
    onClick(text)
  }, [onClick])

  return (
    <Box
      component="button"
      type="button"
      px="lg"
      py="md"
      bdrs="lg"
      h={86}
      className={`${classes.box} ${variantClassName} ${statusClassName} ${disabled ? classes.disabled : ''}`}
      onClick={() => handleOnClick(text)}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <Center h={50}>
        <Text className={classes.text}>{text}</Text>
      </Center>
    </Box>
  )
}

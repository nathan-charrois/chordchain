import { useCallback, useMemo } from 'react'
import { Box, Center, Text } from '@mantine/core'

import classes from './PalleteButton.module.css'

type Props = {
  text: string
  variant?: 'primary' | 'secondary'
  onClick: (text: string) => void
}

export default function PalleteButton({
  text,
  variant,
  onClick,
}: Props) {
  const variantClassName = useMemo(() => (
    variant === 'secondary' ? classes.secondary : classes.primary
  ), [variant])

  const handleOnClick = useCallback((text: string) => {
    onClick(text)
  }, [onClick])

  return (
    <Box
      px="lg"
      py="md"
      bdrs="lg"
      h={86}
      className={`${classes.box} ${variantClassName}`}
      onClick={() => handleOnClick(text)}
    >
      <Center h={50}>
        <Text className={classes.text}>{text}</Text>
      </Center>
    </Box>
  )
}

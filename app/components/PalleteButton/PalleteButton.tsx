import { useMemo } from 'react'
import { Box, Center, Text } from '@mantine/core'

import classes from './PalleteButton.module.css'

type Props = {
  text: string
  variant?: 'primary' | 'secondary'
}

export default function PalleteButton({ text, variant = 'primary' }: Props) {
  const variantClassName = useMemo(() => (
    variant === 'primary' ? classes.primary : classes.secondary
  ), [variant])

  return (
    <Box
      className={`${classes.box} ${variantClassName}`}
      px="lg"
      py="md"
      bdrs="lg"
      h={86}
    >
      <Center h={50}>
        <Text className={classes.text}>{text}</Text>
      </Center>
    </Box>
  )
}

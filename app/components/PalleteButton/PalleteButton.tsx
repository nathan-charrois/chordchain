import { Box, Center, Text } from '@mantine/core'

import classes from './PalleteButton.module.css'

type Props = {
  character: string
}

export default function PalleteButton({ character }: Props) {
  return (
    <Box className={classes.box} px="lg">
      <Center>
        <Text className={classes.text}>{character}</Text>
      </Center>
    </Box>
  )
}

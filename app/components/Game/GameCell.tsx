import { useEffect } from 'react'
import { Box, Center, Text } from '@mantine/core'

import type { CellStatus } from './context/GameContext'
import {
  getCellClassName,
  getCellTextColor,
} from './logic/game'
import { useAnimation } from '~/hooks/useAnimation'

type Props = {
  isActive: boolean
  character: string
  status?: CellStatus
}

function GameCell({ isActive, character, status }: Props) {
  const { ref, animate } = useAnimation({ className: 'animate-bounceIn', isActive })

  useEffect(() => {
    if (character && !status) {
      animate()
    }
  }, [animate, character, status])

  const color = getCellTextColor(status)
  const className = getCellClassName(status)

  return (
    <Box c={color} h={90} className={className}>
      <Center ref={ref} h={86}>
        <Text size="xl" fw="bold">{character}</Text>
      </Center>
    </Box>
  )
}

export default GameCell

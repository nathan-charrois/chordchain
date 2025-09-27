import { useEffect } from 'react'
import { Box } from '@mantine/core'

import type { CellStatus } from './context/GameContext'
import {
  getBackgroundColor,
  getStatusBackgroundColor,
  getStatusTextColor,
  getTextColor,
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

  const bg = status
    ? getStatusBackgroundColor(status)
    : getBackgroundColor(isActive)

  const color = status
    ? getStatusTextColor(status)
    : getTextColor(isActive, character)

  return (
    <Box bg={bg} c={color} py="sm" ta="center" mih={50} fw="bold">
      <div ref={ref}>
        {character}
      </div>
    </Box>
  )
}

export default GameCell

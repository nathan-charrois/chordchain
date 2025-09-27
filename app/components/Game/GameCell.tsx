import { Box } from '@mantine/core'

import type { CellStatus } from './context/GameContext'
import {
  getBackgroundColor,
  getStatusBackgroundColor,
  getStatusTextColor,
  getTextColor,
} from './logic/game'

type Props = {
  isActive: boolean
  character: string
  status?: CellStatus
}

function GameCell({ isActive, character, status }: Props) {
  const bg = status
    ? getStatusBackgroundColor(status)
    : getBackgroundColor(isActive)

  const color = status
    ? getStatusTextColor(status)
    : getTextColor(isActive, character)

  return (
    <Box bg={bg} c={color} py="sm" ta="center" mih={50}>
      {character}
    </Box>
  )
}

export default GameCell

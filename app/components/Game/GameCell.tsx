import { Box } from '@mantine/core'

import type { CellStatus } from './context/GameContext'
import {
  getBackgroundColor,
  getStatusBackgroundColor,
  getStatusTextColor,
  getTextColor,
} from './logic/game'

type Props = {
  isActiveRow: boolean
  character: string
  status?: CellStatus
}

function GameCell({ isActiveRow, character, status }: Props) {
  const bg = status
    ? getStatusBackgroundColor(status)
    : getBackgroundColor(isActiveRow)

  const color = status
    ? getStatusTextColor(status)
    : getTextColor(isActiveRow, character)

  return (
    <Box bg={bg} c={color} py="sm" ta="center" mih={50}>
      {character}
    </Box>
  )
}

export default GameCell

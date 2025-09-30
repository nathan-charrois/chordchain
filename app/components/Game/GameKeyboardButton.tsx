import { Box, Center, Text } from '@mantine/core'

import type { Guess } from './context/GameContext'
import { getCellStatus, getCellTextColor, getKeyClassName } from './logic/game'

type GameKeyboardButtonProps = {
  character: string
  guesses: Guess[]
  onClick: React.MouseEventHandler<HTMLDivElement>
}

export default function GameKeyboardButton({ character, guesses, onClick }: GameKeyboardButtonProps) {
  const status = getCellStatus(character, guesses)
  const color = getCellTextColor(status)
  const className = getKeyClassName(status)

  return (
    <Box c={color} h={50} className={className} onClick={onClick}>
      <Center h={48}>
        <Text size="sm" fw="bold">{character}</Text>
      </Center>
    </Box>
  )
}

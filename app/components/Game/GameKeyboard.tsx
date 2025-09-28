import { useEffect, useMemo } from 'react'
import { Box, Card, Center, type DefaultMantineColor, Group, Text } from '@mantine/core'

import { useGame } from './hooks/useGame'
import { getCellStatus, getCellTextColor, getKeyClassName } from './logic/game'

const keys = [
  '0', '1', '2', '3', '4',
  '5', '6', '7', '8', '9',
]

const operations = [
  '+', '-', '*',
  '/', '(', ')',
]

type Props = {
  color: DefaultMantineColor
  className: string
  onClick: React.MouseEventHandler<HTMLDivElement>
  value: string
  width: number
}

function GameKeyboardButton({ color, className, onClick, value, width }: Props) {
  return (
    <Box c={color} w={width} h={42} className={className} onClick={onClick}>
      <Center h={38}>
        <Text size="sm" fw="bold">{value}</Text>
      </Center>
    </Box>
  )
}

export default function GameKeyboard() {
  const {
    setGuess,
    guesses,
    deleteGuess,
    submitGuess,
    resetGame,
  } = useGame()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      if (keys.includes(e.key)) {
        setGuess(e.key)
      }
      else if (e.key === 'Enter') {
        submitGuess()
      }
      else if (e.key === 'Backspace') {
        deleteGuess()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setGuess, submitGuess, deleteGuess, resetGame])

  const numberRow = useMemo(() => (
    keys.map((character) => {
      const status = getCellStatus(character, guesses)
      const color = getCellTextColor(status)
      const className = getKeyClassName(status)

      return (
        <GameKeyboardButton
          value={character}
          width={60}
          color={color}
          className={className}
          onClick={() => setGuess(character)}
        />
      )
    })
  ), [setGuess, guesses])

  const operationsRow = useMemo(() => (
    operations.map((character) => {
      const status = getCellStatus(character, guesses)
      const color = getCellTextColor(status)
      const className = getKeyClassName(status)

      return (
        <GameKeyboardButton
          value={character}
          width={60}
          color={color}
          className={className}
          onClick={() => setGuess(character)}
        />
      )
    })
  ), [setGuess, guesses])

  return (
    <Card>
      <Group mb="sm">{numberRow}</Group>
      <Group>
        <GameKeyboardButton
          value="Enter"
          width={85}
          color="white"
          className="key key-large-default"
          onClick={submitGuess}
        />
        {operationsRow}
        <GameKeyboardButton
          value="Delete"
          width={85}
          color="white"
          className="key key-large-default"
          onClick={deleteGuess}
        />
        <GameKeyboardButton
          value="Reset"
          width={85}
          color="white"
          className="key key-large-default"
          onClick={resetGame}
        />
      </Group>
    </Card>
  )
}

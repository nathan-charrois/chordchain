import { useCallback } from 'react'
import { Card, Group, Stack } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getGuessStatus } from '../Game/logic/game'
import PalleteButton from '../PalleteButton/PalleteButton'

export default function Pallete() {
  const { status, guesses, paletteChords, addCurrent, removeCurrent, submitGuess } = useGame()
  const isLocked = status === 'won' || status === 'loss'

  const handleClickChord = useCallback((chord: string) => {
    addCurrent(chord)
  }, [addCurrent])

  const handleClickUndo = useCallback(() => {
    removeCurrent()
  }, [removeCurrent])

  const handleClickEnter = useCallback(() => {
    submitGuess()
  }, [submitGuess])

  return (
    <Card bdrs="md" p="xl">
      <Stack>
        <Group>
          {paletteChords.map(chord => (
            <PalleteButton
              key={chord}
              onClick={handleClickChord}
              text={chord}
              status={getGuessStatus(chord, guesses)}
              disabled={isLocked}
            />
          ))}
        </Group>
        <Group>
          <PalleteButton onClick={handleClickUndo} text="Undo" variant="secondary" disabled={isLocked} />
          <PalleteButton onClick={handleClickEnter} text="Enter" variant="secondary" disabled={isLocked} />
        </Group>
      </Stack>
    </Card>
  )
}

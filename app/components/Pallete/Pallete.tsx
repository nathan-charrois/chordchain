import { useCallback } from 'react'
import { Card, Group, Stack } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getGuessStatus } from '../Game/logic/game'
import PalleteButton from '../PalleteButton/PalleteButton'
import classes from './Pallete.module.css'

export default function Pallete() {
  const { status, guesses, paletteChords, addCurrent, removeCurrent, submitGuess } = useGame()
  const isLocked = status === 'won' || status === 'loss'
  const primaryRow = paletteChords.slice(0, 5)
  const secondaryRow = paletteChords.slice(5)

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
    <Card className={classes.card} m="lg" p="lg" bdrs="lg" ta="center">
      <Stack>
        <Group grow gap="lg" mb="md">
          {primaryRow.map(chord => (
            <PalleteButton
              key={chord}
              onClick={handleClickChord}
              text={chord}
              status={getGuessStatus(chord, guesses)}
              disabled={isLocked}
            />
          ))}
        </Group>
        <Group grow gap="lg" mb="md">
          <PalleteButton onClick={handleClickUndo} text="Undo" variant="secondary" disabled={isLocked} />
          <Group grow gap="lg">
            {secondaryRow.map(chord => (
              <PalleteButton
                key={chord}
                onClick={handleClickChord}
                text={chord}
                status={getGuessStatus(chord, guesses)}
                disabled={isLocked}
              />
            ))}
          </Group>
          <PalleteButton onClick={handleClickEnter} text="Enter" variant="secondary" disabled={isLocked} />
        </Group>
      </Stack>
    </Card>
  )
}

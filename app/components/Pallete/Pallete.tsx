import { useCallback } from 'react'
import { Card, Group, Stack } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getGuessStatus } from '../Game/logic/game'
import PalleteButton from '../PalleteButton/PalleteButton'
import classes from './Pallete.module.css'

export default function Pallete() {
  const { status, guesses, addCurrent, removeCurrent, submitGuess } = useGame()
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
    <Card className={classes.card} m="lg" p="lg" bdrs="lg" ta="center">
      <Stack>
        <Group grow gap="lg" mb="md">
          <PalleteButton onClick={handleClickChord} text="C" status={getGuessStatus('C', guesses)} disabled={isLocked} />
          <PalleteButton onClick={handleClickChord} text="Dm" status={getGuessStatus('Dm', guesses)} disabled={isLocked} />
          <PalleteButton onClick={handleClickChord} text="Em" status={getGuessStatus('Em', guesses)} disabled={isLocked} />
          <PalleteButton onClick={handleClickChord} text="F" status={getGuessStatus('F', guesses)} disabled={isLocked} />
          <PalleteButton onClick={handleClickChord} text="G" status={getGuessStatus('G', guesses)} disabled={isLocked} />
        </Group>
        <Group grow gap="lg" mb="md">
          <PalleteButton onClick={handleClickUndo} text="Undo" variant="secondary" disabled={isLocked} />
          <Group grow gap="lg">
            <PalleteButton onClick={handleClickChord} text="Am" status={getGuessStatus('Am', guesses)} disabled={isLocked} />
            <PalleteButton onClick={handleClickChord} text="Bdim" status={getGuessStatus('Bdim', guesses)} disabled={isLocked} />
          </Group>
          <PalleteButton onClick={handleClickEnter} text="Enter" variant="secondary" disabled={isLocked} />
        </Group>
      </Stack>
    </Card>
  )
}

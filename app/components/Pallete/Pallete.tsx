import { useCallback } from 'react'
import { Card, Group, Stack } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getGuessStatus } from '../Game/logic/game'
import PalleteButton from '../PalleteButton/PalleteButton'
import classes from './Pallete.module.css'

export default function Pallete() {
  const { guesses, addCurrent, removeCurrent, submitGuess } = useGame()

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
          <PalleteButton onClick={handleClickChord} text="C" status={getGuessStatus('C', guesses)} />
          <PalleteButton onClick={handleClickChord} text="Dm" status={getGuessStatus('Dm', guesses)} />
          <PalleteButton onClick={handleClickChord} text="Em" status={getGuessStatus('Em', guesses)} />
          <PalleteButton onClick={handleClickChord} text="F" status={getGuessStatus('F', guesses)} />
          <PalleteButton onClick={handleClickChord} text="G" status={getGuessStatus('G', guesses)} />
        </Group>
        <Group grow gap="lg" mb="md">
          <PalleteButton onClick={handleClickUndo} text="Undo" variant="secondary" />
          <Group grow gap="lg">
            <PalleteButton onClick={handleClickChord} text="Am" status={getGuessStatus('Am', guesses)} />
            <PalleteButton onClick={handleClickChord} text="Bdim" status={getGuessStatus('Bdim', guesses)} />
          </Group>
          <PalleteButton onClick={handleClickEnter} text="Enter" variant="secondary" />
        </Group>
      </Stack>
    </Card>
  )
}

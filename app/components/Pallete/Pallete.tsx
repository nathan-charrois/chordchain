import { useCallback } from 'react'
import { Card, Group, Stack } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import PalleteButton from '../PalleteButton/PalleteButton'
import classes from './Pallete.module.css'

export default function Pallete() {
  const { current, addCurrent, removeCurrent, submitGuess, maxLength } = useGame()

  const handleClickChord = useCallback((chord: string) => {
    if (current.chords.length < maxLength) {
      addCurrent(chord)
    }
    else {
      console.log('Max chords reached')
    }
  }, [addCurrent, current])

  const handleClickUndo = useCallback(() => {
    removeCurrent()
  }, [removeCurrent])

  const handleClickEnter = useCallback(() => {
    if (current.chords.length >= maxLength) {
      submitGuess()
    }
    else {
      console.log('Not enough chords')
    }
  }, [submitGuess, current, maxLength])

  return (
    <Card className={classes.card} m="lg" p="lg" bdrs="lg" ta="center">
      <Stack>
        <Group grow gap="lg" mb="md">
          <PalleteButton onClick={handleClickChord} text="C" />
          <PalleteButton onClick={handleClickChord} text="Dm" />
          <PalleteButton onClick={handleClickChord} text="Em" />
          <PalleteButton onClick={handleClickChord} text="F" />
          <PalleteButton onClick={handleClickChord} text="G" />
        </Group>
        <Group grow gap="lg" mb="md">
          <PalleteButton onClick={handleClickUndo} text="Undo" variant="secondary" />
          <Group grow gap="lg">
            <PalleteButton onClick={handleClickChord} text="Am" />
            <PalleteButton onClick={handleClickChord} text="Bdim" />
          </Group>
          <PalleteButton onClick={handleClickEnter} text="Enter" variant="secondary" />
        </Group>
      </Stack>
    </Card>
  )
}

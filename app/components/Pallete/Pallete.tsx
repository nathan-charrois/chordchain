import { useCallback } from 'react'
import { Card, Group, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getGuessStatus } from '../Game/logic/game'
import PalleteButton from '../PalleteButton/PalleteButton'
import { getPaletteSections } from '~/utils/music'

type PaletteSection = {
  title: string
  chords: string[]
}

export default function Pallete() {
  const { status, guesses, activePuzzle, addCurrent, removeCurrent, submitGuess } = useGame()
  const isLocked = status === 'won' || status === 'loss'
  const paletteSectionsData = getPaletteSections(activePuzzle.key, activePuzzle.mode)
  const sections: PaletteSection[] = [
    { title: 'Diatonic', chords: paletteSectionsData.diatonic },
    { title: 'Secondary/Dominant', chords: paletteSectionsData.secondaryDominant },
    { title: 'Extensions', chords: paletteSectionsData.extensions },
  ]

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
      <Stack gap="md">
        {sections.map(section => (
          <Stack key={section.title} gap="xs">
            <Text fw={700} size="sm" tt="uppercase" c="dimmed">{section.title}</Text>
            <Group>
              {section.chords.map((chord, chordIndex) => (
                <PalleteButton
                  key={`${section.title}-${chord}-${chordIndex}`}
                  onClick={handleClickChord}
                  text={chord}
                  status={getGuessStatus(chord, guesses)}
                  disabled={isLocked}
                  variant="default"
                />
              ))}
            </Group>
          </Stack>
        ))}
        <Group>
          <PalleteButton onClick={handleClickUndo} text="Undo" variant="filled" disabled={isLocked} />
          <PalleteButton onClick={handleClickEnter} text="Enter" variant="filled" disabled={isLocked} />
        </Group>
      </Stack>
    </Card>
  )
}

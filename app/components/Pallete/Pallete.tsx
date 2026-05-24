import { useCallback } from 'react'
import { Card, Group, NativeSelect, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getGuessStatus } from '../Game/logic/game'
import PalleteButton from '../PalleteButton/PalleteButton'
import { formatModeLabel, getPaletteSections, MODE_IDS, normalizeModeId, PITCH_CLASSES } from '~/utils/music'

type PaletteSection = {
  title: string
  chords: string[]
}

export default function Pallete() {
  const {
    status,
    guesses,
    selectedKey,
    selectedMode,
    hintProgress,
    setSelectedKey,
    setSelectedMode,
    addCurrent,
    removeCurrent,
    submitGuess,
  } = useGame()
  const isLocked = status === 'won' || status === 'loss'
  const isKeyLocked = isLocked || hintProgress >= 1
  const isModeLocked = isLocked || hintProgress >= 2
  const paletteSectionsData = getPaletteSections(selectedKey, selectedMode)
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

  const handleSelectKey = useCallback((value: string | null) => {
    if (!value) {
      return
    }

    setSelectedKey(value)
  }, [setSelectedKey])

  const handleSelectMode = useCallback((value: string | null) => {
    if (!value) {
      return
    }

    setSelectedMode(normalizeModeId(value))
  }, [setSelectedMode])

  return (
    <Card bdrs="md" p="xl">
      <Stack gap="md">
        <NativeSelect
          label="Palette key"
          data={[...PITCH_CLASSES]}
          value={selectedKey}
          disabled={isKeyLocked}
          onChange={event => handleSelectKey(event.currentTarget.value)}
        />
        <NativeSelect
          label="Palette mode"
          data={MODE_IDS.map(mode => ({ value: mode, label: formatModeLabel(mode) }))}
          value={selectedMode}
          disabled={isModeLocked}
          onChange={event => handleSelectMode(event.currentTarget.value)}
        />
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

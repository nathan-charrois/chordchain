import { useCallback, useMemo } from 'react'
import { Group, NativeSelect, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getGuessStatus } from '../Game/logic/game'
import PalleteButton from '../PalleteButton/PalleteButton'
import Card from '~/components/Card/Card'
import { formatModeLabel, MODE_IDS, normalizeModeId, type PaletteSectionId, PITCH_CLASSES } from '~/utils/music'

type PaletteSection = {
  id: PaletteSectionId
  title: string
  chords: string[]
}

export default function Pallete() {
  const {
    status,
    guesses,
    selectedKey,
    selectedMode,
    paletteSections,
    enabledPaletteSectionIds,
    setSelectedKey,
    setSelectedMode,
    addCurrent,
    removeCurrent,
    submitGuess,
  } = useGame()
  const isLocked = status === 'won' || status === 'loss'
  const sections: PaletteSection[] = [
    { id: 'diatonic', title: 'Diatonic', chords: paletteSections.diatonic },
    { id: 'secondaryDominant', title: 'Secondary/Dominant', chords: paletteSections.secondaryDominant },
    { id: 'extensions', title: 'Extensions', chords: paletteSections.extensions },
  ]
  const enabledPaletteSectionIdSet = useMemo(
    () => new Set(enabledPaletteSectionIds),
    [enabledPaletteSectionIds],
  )

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
    <Card bdrs="md" mt="md" withBorder>
      <Stack gap="md">
        <NativeSelect
          label="Palette key"
          data={[...PITCH_CLASSES]}
          value={selectedKey}
          disabled={isLocked}
          onChange={event => handleSelectKey(event.currentTarget.value)}
        />
        <NativeSelect
          label="Palette mode"
          data={MODE_IDS.map(mode => ({ value: mode, label: formatModeLabel(mode) }))}
          value={selectedMode}
          disabled={isLocked}
          onChange={event => handleSelectMode(event.currentTarget.value)}
        />
        {sections.map((section) => {
          const isSectionEnabled = enabledPaletteSectionIdSet.has(section.id)
          const isSectionLocked = isLocked || !isSectionEnabled

          return (
            <Stack key={section.id} gap="xs">
              <Group gap="xs" align="center">
                <Text fw={700} size="sm" tt="uppercase" c={isSectionEnabled ? 'dimmed' : 'gray.5'}>{section.title}</Text>
              </Group>
              <Group>
                {section.chords.map((chord, chordIndex) => (
                  <PalleteButton
                    key={`${section.title}-${chord}-${chordIndex}`}
                    onClick={handleClickChord}
                    text={chord}
                    status={getGuessStatus(chord, guesses)}
                    disabled={isSectionLocked}
                    variant="default"
                  />
                ))}
              </Group>
            </Stack>
          )
        })}
        <Group>
          <PalleteButton onClick={handleClickUndo} text="Undo" variant="filled" disabled={isLocked} />
          <PalleteButton onClick={handleClickEnter} text="Enter" variant="filled" disabled={isLocked} />
        </Group>
      </Stack>
    </Card>
  )
}

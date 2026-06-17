import { useCallback, useMemo } from 'react'
import { Link01Icon, Undo03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Group, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getGuessStatus } from '../Game/logic/game'
import PalleteButton from '../PalleteButton/PalleteButton'
import Card from '~/components/Card/Card'
import { type PaletteSectionId } from '~/utils/music'

type PaletteSection = {
  id: PaletteSectionId
  title: string
  chords: string[]
}

export default function Pallete() {
  const {
    status,
    guesses,
    paletteSections,
    enabledPaletteSectionIds,
    addCurrent,
    removeCurrent,
    submitGuess,
  } = useGame()

  const disabled = status === 'won' || status === 'loss'

  const sections: PaletteSection[] = [
    { id: 'diatonic', title: 'Diatonic', chords: paletteSections.diatonic },
    { id: 'secondaryDominant', title: 'Secondary / Dominant', chords: paletteSections.secondaryDominant },
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

  return (
    <>
      <Card mt="lg">
        <Stack gap="lg">
          {sections.map((section) => {
            const isSectionEnabled = enabledPaletteSectionIdSet.has(section.id)

            if (!isSectionEnabled) {
              return
            }

            return (
              <Stack key={section.id} gap="xs">
                <Group gap="xs" align="center">
                  <Text fw={500} size="md">{section.title}</Text>
                </Group>
                <Group grow>
                  {section.chords.map((chord, chordIndex) => (
                    <PalleteButton
                      key={`${section.title}-${chord}-${chordIndex}`}
                      onClick={handleClickChord}
                      text={chord}
                      subtext="iv"
                      status={getGuessStatus(chord, guesses)}
                      disabled={disabled}
                    />
                  ))}
                </Group>
              </Stack>
            )
          })}
        </Stack>
      </Card>
      <Group justify="flex-end" my="xl">
        <Button
          leftSection={<HugeiconsIcon icon={Undo03Icon} aria-label="Undo" />}
          onClick={handleClickUndo}
          disabled={disabled}
          variant="subtle"
          size="lg"
          radius="md"
        >
          Undo
        </Button>
        <Button
          leftSection={<HugeiconsIcon icon={Link01Icon} aria-label="Enter" />}
          onClick={handleClickEnter}
          disabled={disabled}
          variant="filled"
          size="lg"
          radius="md"
        >
          Enter
        </Button>
      </Group>
    </>
  )
}

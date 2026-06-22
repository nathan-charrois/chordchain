import { useCallback, useMemo } from 'react'
import { Link01Icon, Undo03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Flex, Group, SimpleGrid, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { getGuessStatus } from '../Game/logic/game'
import PalleteButton from '../PalleteButton/PalleteButton'
import Card from '~/components/Card/Card'
import { responsiveSizing } from '~/constant'
import type { ChordId, DisplayChord, PaletteChordIds } from '~/utils/music'
import { buildChord, buildPaletteChordIds, buildScale, chordIdKey } from '~/utils/music'

type PaletteSection = {
  id: keyof PaletteChordIds
  title: string
  chords: Array<{
    id: ChordId
    display: DisplayChord
  }>
}

export default function Pallete() {
  const {
    status,
    guesses,
    activePuzzle,
    addCurrent,
    removeCurrent,
    submitGuess,
  } = useGame()

  const disabled = status === 'won' || status === 'loss'

  const sections = useMemo<PaletteSection[]>(() => {
    const scale = buildScale(activePuzzle.key, activePuzzle.mode)
    const paletteChordIds = buildPaletteChordIds(activePuzzle.difficulty)
    const buildSection = (
      id: keyof PaletteChordIds,
      title: string,
    ): PaletteSection => ({
      id,
      title,
      chords: paletteChordIds[id].map(chord => ({
        id: chord,
        display: buildChord(scale, chord),
      })),
    })

    return [
      buildSection('triad', 'Triads'),
      buildSection('seventh', 'Sevenths'),
      buildSection('extension', 'Extensions'),
    ]
  }, [activePuzzle.difficulty, activePuzzle.key, activePuzzle.mode])

  const handleClickChord = useCallback((chord: ChordId) => {
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
      <Card mt="lg" p={responsiveSizing}>
        <Stack gap="lg">
          {sections.map((section) => {
            if (!section.chords.length) {
              return
            }

            return (
              <Stack key={section.id} gap="xs">
                <Group gap="xs" align="center">
                  <Text fw={500} size="md">{section.title}</Text>
                </Group>
                <SimpleGrid
                  cols={{ base: 3, sm: 4 }}
                  spacing={{ base: 'xs', sm: 'md' }}
                  verticalSpacing={{ base: 'xs', sm: 'md' }}
                >
                  {section.chords
                    .map(chord => (
                      <PalleteButton
                        key={`${section.id}-${chordIdKey(chord.id)}`}
                        onClick={() => handleClickChord(chord.id)}
                        text={chord.display.name}
                        subtext={chord.display.numeral}
                        status={getGuessStatus(chord.id, guesses, activePuzzle.progression)}
                        disabled={disabled}
                      />
                    ))}
                </SimpleGrid>
              </Stack>
            )
          })}
        </Stack>
      </Card>
      <Flex my="xl" gap="lg">
        <Button
          leftSection={<HugeiconsIcon icon={Undo03Icon} aria-label="Undo" />}
          onClick={handleClickUndo}
          disabled={disabled}
          variant="light"
          radius="md"
          size="lg"
          flex={1}
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
          flex={1}
        >
          Submit Chain
        </Button>
      </Flex>
    </>
  )
}

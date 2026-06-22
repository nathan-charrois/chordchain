import { Box, Flex, Stack, Text, UnstyledButton } from '@mantine/core'

import type { DisplayChord } from '~/utils/music'
import { playTone } from '~/utils/music'

type PianoRollProps = {
  chord: DisplayChord | null
}

type PianoKey = {
  label: string
  pitchClass: number
}

const WHITE_KEYS: PianoKey[] = [
  { label: 'C', pitchClass: 0 },
  { label: 'D', pitchClass: 2 },
  { label: 'E', pitchClass: 4 },
  { label: 'F', pitchClass: 5 },
  { label: 'G', pitchClass: 7 },
  { label: 'A', pitchClass: 9 },
  { label: 'B', pitchClass: 11 },
]

const BLACK_KEYS = [
  { label: 'C sharp', left: 1, pitchClass: 1 },
  { label: 'D sharp', left: 2, pitchClass: 3 },
  { label: 'F sharp', left: 4, pitchClass: 6 },
  { label: 'G sharp', left: 5, pitchClass: 8 },
  { label: 'A sharp', left: 6, pitchClass: 10 },
] as const

const NATURAL_PITCH_CLASSES: Record<string, number> = {
  A: 9,
  B: 11,
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
}

function noteToPitchClass(note: string): number {
  const [, letter, accidentals = ''] = /^([A-G])([#b]*)$/.exec(note) ?? []

  if (!letter) {
    return -1
  }

  const accidentalOffset = [...accidentals].reduce((total, accidental) => (
    total + (accidental === '#' ? 1 : -1)
  ), 0)

  return (NATURAL_PITCH_CLASSES[letter] + accidentalOffset + 12) % 12
}

function buildActiveNotes(notes: string[]): Map<number, string> {
  return new Map(notes.map(note => [noteToPitchClass(note), note]))
}

export default function PianoRoll({ chord }: PianoRollProps) {
  const activeNotes = buildActiveNotes(chord?.notes ?? [])
  const chordDescription = chord
    ? `${chord.name}: ${chord.notes.join(', ')}`
    : 'Hover a chord to preview its notes. Press a key to play it.'

  const handlePlayNote = (pitchClass: number) => {
    playTone(pitchClass, 4)
  }

  return (
    <Stack gap="xs" h="100%" justify="center">
      <Flex justify="space-between" align="baseline" wrap="wrap" gap={{ base: 0, sm: 'xs' }} mih={28}>
        <Text fw={600} c={chord ? 'teal.8' : 'dimmed'}>
          {chord?.name ?? 'Chord preview'}
        </Text>
        <Text size="sm" c="dimmed">
          {chord ? `${chord.numeral} · ${chord.notes.join(' · ')}` : 'Hover a chord'}
        </Text>
      </Flex>

      <Box
        aria-label={chordDescription}
        pos="relative"
        h={132}
        style={{
          display: 'flex',
          isolation: 'isolate',
        }}
      >
        {WHITE_KEYS.map((key, index) => {
          const activeNote = activeNotes.get(key.pitchClass)

          return (
            <UnstyledButton
              key={`${key.label}-${index}`}
              aria-label={`Play ${key.label}`}
              aria-pressed={Boolean(activeNote)}
              onClick={() => handlePlayNote(key.pitchClass)}
              bg={activeNote ? 'teal.0' : 'white'}
              bd="1px solid gray.4"
              flex={1}
              pos="relative"
              style={{
                borderRadius: index === 0
                  ? 'var(--mantine-radius-sm) 0 0 var(--mantine-radius-sm)'
                  : index === WHITE_KEYS.length - 1
                    ? '0 var(--mantine-radius-sm) var(--mantine-radius-sm) 0'
                    : undefined,
                marginLeft: index === 0 ? 0 : -1,
              }}
            >
              {activeNote && (
                <>
                  <Box
                    bg="teal.6"
                    pos="absolute"
                    bottom={22}
                    left="50%"
                    w={12}
                    h={12}
                    style={{
                      borderRadius: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                  <Text
                    c="teal.8"
                    fz="xs"
                    fw={600}
                    pos="absolute"
                    bottom={3}
                    left="50%"
                    style={{ transform: 'translateX(-50%)' }}
                  >
                    {activeNote}
                  </Text>
                </>
              )}
            </UnstyledButton>
          )
        })}

        {BLACK_KEYS.map((key) => {
          const isActive = activeNotes.has(key.pitchClass)

          return (
            <UnstyledButton
              key={key.pitchClass}
              aria-label={`Play ${key.label}`}
              aria-pressed={isActive}
              onClick={() => handlePlayNote(key.pitchClass)}
              bg={isActive ? 'teal.6' : 'dark.8'}
              pos="absolute"
              top={0}
              left={`${(key.left / WHITE_KEYS.length) * 100}%`}
              w={`${(0.58 / WHITE_KEYS.length) * 100}%`}
              h="62%"
              style={{
                borderRadius: '0 0 var(--mantine-radius-xs) var(--mantine-radius-xs)',
                boxShadow: 'var(--mantine-shadow-xs)',
                transform: 'translateX(-50%)',
                zIndex: 1,
              }}
            />
          )
        })}
      </Box>
    </Stack>
  )
}

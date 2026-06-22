import { useCallback, useMemo, useState } from 'react'
import { Alert, Badge, Center, Flex, Group, SimpleGrid, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { buildGuessRows, getGuessCellColor } from '../Game/logic/game'
import { getEndStateMessage, isGameOverStatus, shouldRevealProgression } from '../Game/logic/session'
import PlaybackControls from './components/PlaybackControls'
import { useSequence } from './hooks/useSequence'
import Card from '~/components/Card/Card'
import { responsiveSizing } from '~/constant'
import { DEFAULT_TEMPO_BPM } from '~/utils/chain'
import { buildChord, buildChords, buildScale, chordIdKey } from '~/utils/music'

const cellHeight = {
  base: 86,
  xs: 102,
  md: 144,
}

const cellFontSize = {
  xs: 'lg',
  md: 'xl',
}

export default function Board() {
  const {
    status,
    guesses,
    current,
    maxLength,
    maxGuesses,
    activePuzzle,
  } = useGame()

  const {
    progression,
    activeIndex,
    isPlaying,
    play,
    stop,
    restart,
  } = useSequence()

  const [isArpeggiate, setIsArpeggiate] = useState(true)
  const [isDrumsEnabled, setIsDrumsEnabled] = useState(true)
  const [tempoBpm, setTempoBpm] = useState(DEFAULT_TEMPO_BPM)

  const handleTogglePlayback = useCallback(() => {
    if (isPlaying) {
      stop()
      return
    }

    play({
      arpeggiate: isArpeggiate,
      drums: isDrumsEnabled,
      loop: true,
      tempoBpm,
    })
  }, [isPlaying, stop, play, isArpeggiate, isDrumsEnabled, tempoBpm])

  const handleToggleArpeggiate = useCallback(() => {
    const nextIsArpeggiate = !isArpeggiate

    setIsArpeggiate(nextIsArpeggiate)

    if (isPlaying) {
      restart({
        arpeggiate: nextIsArpeggiate,
        drums: isDrumsEnabled,
        loop: true,
        tempoBpm,
      })
    }
  }, [isArpeggiate, isPlaying, restart, isDrumsEnabled, tempoBpm])

  const handleToggleDrums = useCallback(() => {
    const nextIsDrumsEnabled = !isDrumsEnabled

    setIsDrumsEnabled(nextIsDrumsEnabled)

    if (isPlaying) {
      restart({
        arpeggiate: isArpeggiate,
        drums: nextIsDrumsEnabled,
        loop: true,
        tempoBpm,
      })
    }
  }, [isDrumsEnabled, isPlaying, restart, isArpeggiate, tempoBpm])

  const handleTempoChange = useCallback((nextTempoBpm: number) => {
    setTempoBpm(nextTempoBpm)

    if (isPlaying) {
      restart({
        arpeggiate: isArpeggiate,
        drums: isDrumsEnabled,
        loop: true,
        tempoBpm: nextTempoBpm,
      })
    }
  }, [isPlaying, restart, isArpeggiate, isDrumsEnabled])

  const isLoss = status === 'loss'
  const endStateMessage = getEndStateMessage(status)
  const revealProgression = shouldRevealProgression(status)

  const scale = useMemo(
    () => buildScale(activePuzzle.key, activePuzzle.mode),
    [activePuzzle.key, activePuzzle.mode],
  )

  const chords = useMemo(
    () => buildChords(activePuzzle.key, activePuzzle.mode, progression),
    [activePuzzle.key, activePuzzle.mode, progression],
  )

  const guessRows = useMemo(() => {
    return buildGuessRows({
      guesses,
      current,
      status,
      maxGuesses,
      solution: activePuzzle.progression,
    })
  }, [guesses, current, status, maxGuesses, activePuzzle.progression])

  return (
    <>
      {isGameOverStatus(status) && endStateMessage && (
        <Alert mb="lg" color={isLoss ? 'red' : 'green'} title={isLoss ? 'Game Loss' : 'Game Win'} role="status" bdrs="md">
          <Stack gap="xs">
            <Text>{endStateMessage}</Text>
            {revealProgression && (
              <Stack gap={4}>
                <Text size="md">Answer:</Text>
                <Group gap="xs" wrap="wrap">
                  {chords.map((chord, index) => (
                    <Badge key={`${chordIdKey(chord)}-${index}`} color="green.7" variant="filled" size="lg" miw={64} bdrs="md">
                      {chord.name}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            )}
          </Stack>
        </Alert>
      )}
      <Card p={responsiveSizing}>
        <Flex direction="column" gap={responsiveSizing}>
          {guessRows.map(row => (
            <SimpleGrid
              key={row.index}
              cols={maxLength}
              spacing={responsiveSizing}
              aria-label={`Guess ${row.index + 1} ${row.kind}`}
            >
              {Array.from({ length: maxLength }, (_, cellIndex) => {
                const chord = row.chords[cellIndex]
                const chordName = chord ? buildChord(scale, chord).name : ''

                return (
                  <Center
                    key={`${row.index}-${cellIndex}`}
                    bg={getGuessCellColor(row, cellIndex, activeIndex).background}
                    c={getGuessCellColor(row, cellIndex, activeIndex).color}
                    h={cellHeight}
                    px={2}
                    bdrs="lg"
                    tt="capitalize"
                  >
                    <Text fz={cellFontSize} lh={1.1} fw={500} ta="center">
                      {chordName}
                    </Text>
                  </Center>
                )
              })}
            </SimpleGrid>
          ))}
        </Flex>
      </Card>
      <Card mt="lg" p={responsiveSizing}>
        <PlaybackControls
          isPlaying={isPlaying}
          onTogglePlayback={handleTogglePlayback}
          tempoBpm={tempoBpm}
          onTempoChange={handleTempoChange}
          isArpeggiate={isArpeggiate}
          onToggleArpeggiate={handleToggleArpeggiate}
          isDrumsEnabled={isDrumsEnabled}
          onToggleDrums={handleToggleDrums}
        />
      </Card>
    </>
  )
}

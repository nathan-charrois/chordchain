import { useCallback, useMemo, useState } from 'react'
import { Box, Center, Flex, SimpleGrid, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { buildGuessRows, getGuessCellColor } from '../Game/logic/game'
import LossNotification from './components/LossNotification'
import PlaybackControls from './components/PlaybackControls'
import WinNotification from './components/WinNotification'
import { useSequence } from './hooks/useSequence'
import Card from '~/components/Card/Card'
import { responsiveSizing } from '~/constant'
import { DEFAULT_TEMPO_BPM } from '~/utils/chain'
import { buildChord, buildChords, buildScale } from '~/utils/music'

const cellHeight = {
  base: 78,
  xs: 110,
  md: 136,
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
    isGuessPlaying,
    isSubmittingGuess,
    play,
    stop,
    restart,
  } = useSequence()

  const [isArpeggiate, setIsArpeggiate] = useState(false)
  const [isDrumsEnabled, setIsDrumsEnabled] = useState(false)
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
      isSubmittingGuess,
    })
  }, [guesses, current, status, maxGuesses, activePuzzle.progression, isSubmittingGuess])

  return (
    <>
      {status === 'won' && (
        <WinNotification
          key={activePuzzle.date}
          attemptsUsed={guesses.length}
        />
      )}
      {status === 'loss' && (
        <LossNotification
          key={activePuzzle.date}
          answer={chords}
        />
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
                const cellColor = getGuessCellColor(row, cellIndex, activeIndex, isGuessPlaying)

                return (
                  <Center
                    key={`${row.index}-${cellIndex}`}
                    bg={cellColor.background}
                    c={cellColor.color}
                    bd={cellColor.border}
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
          <SimpleGrid
            cols={maxLength}
            spacing={responsiveSizing}
            aria-hidden
          >
            {Array.from({ length: maxLength }, (_, cellIndex) => (
              <Center key={cellIndex} py="xs">
                <Box
                  w={9}
                  h={9}
                  bdrs="50%"
                  bg={activeIndex === cellIndex ? 'brand.7' : 'gray.3'}
                />
              </Center>
            ))}
          </SimpleGrid>
        </Flex>
      </Card>
      <Card mt={responsiveSizing} p={responsiveSizing}>
        <PlaybackControls
          isPlaying={isPlaying}
          onTogglePlayback={handleTogglePlayback}
          tempoBpm={tempoBpm}
          onTempoChange={handleTempoChange}
          isArpeggiate={isArpeggiate}
          onToggleArpeggiate={handleToggleArpeggiate}
          isDrumsEnabled={isDrumsEnabled}
          onToggleDrums={handleToggleDrums}
          settingsDisabled={isSubmittingGuess}
        />
      </Card>
    </>
  )
}

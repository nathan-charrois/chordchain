import { useCallback, useMemo, useState } from 'react'
import { Idea01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, Badge, Group, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { buildGuessRows, getGuessCellColor } from '../Game/logic/game'
import { getEndStateMessage, isGameOverStatus, shouldRevealTarget } from '../Game/logic/session'
import PlaybackControls from './components/PlaybackControls'
import { useSequence } from './hooks/useSequence'
import Card from '~/components/Card/Card'
import { DEFAULT_TEMPO_BPM } from '~/utils/chain'

export default function Board() {
  const {
    status,
    guesses,
    current,
    maxLength,
    maxGuesses,
  } = useGame()
  const { target, activeIndex, isPlaying, play, stop, setLooping, restartAfterTempoChange } = useSequence()

  const [isLooping, setIsLooping] = useState(true)
  const [isArpeggiate, setIsArpeggiate] = useState(true)
  const [tempoBpm, setTempoBpm] = useState(DEFAULT_TEMPO_BPM)

  const handleTogglePlayback = useCallback(() => {
    if (isPlaying) {
      stop()
      return
    }

    play(isArpeggiate, isLooping, tempoBpm)
  }, [isPlaying, stop, play, isLooping, isArpeggiate, tempoBpm])

  const handleToggleLooping = useCallback(() => {
    const nextIsLooping = !isLooping

    setIsLooping(nextIsLooping)
    setLooping(nextIsLooping)
  }, [isLooping, setLooping])

  const handleToggleArpeggiate = useCallback(() => {
    const nextIsArpeggiate = !isArpeggiate

    setIsArpeggiate(nextIsArpeggiate)

    if (isPlaying) {
      play(nextIsArpeggiate, isLooping, tempoBpm)
    }
  }, [isArpeggiate, isPlaying, play, isLooping, tempoBpm])

  const handleTempoChange = useCallback((nextTempoBpm: number) => {
    setTempoBpm(nextTempoBpm)

    if (isPlaying) {
      restartAfterTempoChange(isArpeggiate, isLooping, nextTempoBpm)
    }
  }, [isPlaying, restartAfterTempoChange, isLooping, isArpeggiate])

  const isLoss = status === 'loss'
  const endStateMessage = getEndStateMessage(status)
  const revealTarget = shouldRevealTarget(status)

  const guessRows = useMemo(() => {
    return buildGuessRows({
      guesses,
      current,
      status,
      maxGuesses,
    })
  }, [guesses, current, status, maxGuesses, target])

  return (
    <>
      {isGameOverStatus(status) && endStateMessage && (
        <Alert mb="lg" color={isLoss ? 'red' : 'green'} title={isLoss ? 'Game Loss' : 'Game Win'} role="status" bdrs="md">
          <Stack gap="xs">
            <Text>{endStateMessage}</Text>
            {revealTarget && (
              <Stack gap={4}>
                <Text size="md">Answer:</Text>
                <Group gap="xs" wrap="wrap">
                  {target.map((chord, index) => (
                    <Badge key={`${chord}-${index}`} color="green.7" variant="filled" size="lg" miw={64} bdrs="md">
                      {chord}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            )}
          </Stack>
        </Alert>
      )}
      <Card>
        <Stack>
          {guessRows.map(row => (
            <>
              <Group
                key={row.index}
                gap="xs"
                wrap="nowrap"
                aria-label={`Guess ${row.index + 1} ${row.kind}`}
              >
                {Array.from({ length: maxLength }, (_, cellIndex) => (
                  <Badge
                    key={`${row.index}-${cellIndex}`}
                    bg={getGuessCellColor(row, cellIndex, activeIndex).background}
                    c={getGuessCellColor(row, cellIndex, activeIndex).color}
                    variant="filled"
                    w="25%"
                    h={120}
                    radius="lg"
                    tt="capitalize"
                  >
                    <Text size="xl" fw={500}>{row.chords[cellIndex]}</Text>
                  </Badge>
                ))}
              </Group>
            </>
          ))}
        </Stack>
        <Group mt="xl" mb="lg" justify="center">
          <HugeiconsIcon icon={Idea01Icon} aria-label="Play" color="#228be6" />
          <Text c="dimmed">Tap a chord below to create a chain.</Text>
        </Group>
      </Card>
      <Card mt="lg">
        <PlaybackControls
          isPlaying={isPlaying}
          onTogglePlayback={handleTogglePlayback}
          tempoBpm={tempoBpm}
          onTempoChange={handleTempoChange}
          isLooping={isLooping}
          onToggleLooping={handleToggleLooping}
          isArpeggiate={isArpeggiate}
          onToggleArpeggiate={handleToggleArpeggiate}
        />
      </Card>
    </>
  )
}

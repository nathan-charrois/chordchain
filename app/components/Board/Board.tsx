import { useCallback, useMemo, useState } from 'react'
import { Alert, Badge, Card, Group, Stack, Text } from '@mantine/core'

import type { GuessStatus } from '../Game/context/GameContext'
import { useGame } from '../Game/hooks/useGame'
import { buildGuessRows, type GuessRow } from '../Game/logic/game'
import {
  getEndStateMessage,
  shouldRevealTarget,
} from '../Game/logic/session'
import { PlaybackControls } from './components/PlaybackControls'
import { useSequence } from './hooks/useSequence'
import { DEFAULT_TEMPO_BPM } from '~/utils/chain'

function getBadgeColor(status?: GuessStatus): string {
  switch (status) {
    case 'correct':
      return 'green.7'
    case 'present':
      return 'yellow.7'
    case 'absent':
      return 'gray.7'
    default:
      return 'gray.5'
  }
}

function getGuessCellLabel(row: GuessRow, cellIndex: number): string {
  return row.chords[cellIndex] ?? ' '
}

function getGuessCellColor(row: GuessRow, cellIndex: number): string {
  if (row.kind === 'submitted') {
    return getBadgeColor(row.status[cellIndex])
  }

  if (row.kind === 'active' && row.chords[cellIndex]) {
    return 'gray.6'
  }

  return 'gray.4'
}

function getGuessCellVariant(row: GuessRow): 'filled' | 'light' | 'outline' {
  if (row.kind === 'submitted') {
    return 'filled'
  }

  if (row.kind === 'active') {
    return 'outline'
  }

  return 'light'
}

export default function Board() {
  const {
    status,
    guesses,
    current,
    maxLength,
    maxGuesses,
    isGameOver,
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
  const shouldShowTarget = shouldRevealTarget(status) || status === 'won'
  const revealedTargetByIndex = useMemo(() => {
    return target.map((_, index) => {
      if (shouldShowTarget) {
        return true
      }

      return guesses.some(guess => guess.status[index] === 'correct')
    })
  }, [guesses, shouldShowTarget, target])

  const guessRows = useMemo(() => {
    return buildGuessRows({
      guesses,
      current,
      status,
      maxGuesses,
    })
  }, [guesses, current, status, maxGuesses])

  return (
    <>
      <Card mb="lg" withBorder>
        <Group gap="xs">
          <Text>Target:</Text>
          {target.map((chord, index) => (
            <Badge
              key={`${chord}-${index}`}
              color={index === activeIndex ? 'lime.6' : 'gray.6'}
              variant={index === activeIndex ? 'filled' : 'light'}
            >
              {revealedTargetByIndex[index] ? chord : '?'}
            </Badge>
          ))}
        </Group>
      </Card>
      <Card mb="lg" withBorder>
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
      <Group grow align="stretch">
      </Group>
      {isGameOver && endStateMessage && (
        <Alert mb="lg" color={isLoss ? 'red' : 'green'} title={isLoss ? 'Run complete: Loss' : 'Run complete: Win'} role="status">
          <Stack gap="xs">
            <Text>{endStateMessage}</Text>
          </Stack>
        </Alert>
      )}
      <Card withBorder>
        <Stack>
          {guessRows.map(row => (
            <Group
              key={row.index}
              gap="xs"
              wrap="nowrap"
              aria-label={`Guess ${row.index + 1} ${row.kind}`}
            >
              {Array.from({ length: maxLength }, (_, cellIndex) => (
                <Badge
                  key={`${row.index}-${cellIndex}`}
                  color={getGuessCellColor(row, cellIndex)}
                  variant={getGuessCellVariant(row)}
                  size="lg"
                  miw={64}
                >
                  {getGuessCellLabel(row, cellIndex)}
                </Badge>
              ))}
            </Group>
          ))}
        </Stack>
      </Card>
    </>
  )
}

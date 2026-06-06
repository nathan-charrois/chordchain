import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Divider, Group, Modal, Stack, Text } from '@mantine/core'

import type { GuessStatus } from '../Game/context/GameContext'
import { useGame } from '../Game/hooks/useGame'
import {
  getAttemptsUsed,
  getEndStateMessage,
  getLossTargetLabel,
  shouldRevealTarget,
} from '../Game/logic/session'
import { DailyPuzzle } from './components/DailyPuzzle'
import { Hints } from './components/Hints'
import { PlaybackControls } from './components/PlaybackControls'
import { Streak } from './components/Streak'
import { useSequence } from './hooks/useSequence'

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

export default function Board() {
  const {
    status,
    guesses,
    current,
    maxGuesses,
    isGameOver,
    activePuzzle,
    todayDate,
    currentStreak,
    puzzleDates,
    historyEntries,
    hintProgress,
    revealHint,
    reset,
  } = useGame()
  const { target, activeIndex, play, stop, end } = useSequence()

  const [isLooping, setIsLooping] = useState(true)
  const [isArpeggiate, setIsArpeggiate] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    if (!isLooping) {
      end()
    }
  }, [isLooping, end])

  const handleClickPlay = useCallback(() => {
    play(isArpeggiate, isLooping)
  }, [play, isLooping, isArpeggiate])

  const handleClickStop = useCallback(() => {
    stop()
  }, [stop])

  const handleToggleLooping = useCallback(() => {
    setIsLooping(prev => !prev)
  }, [setIsLooping])

  const handleToggleArpeggiate = useCallback(() => {
    setIsArpeggiate(prev => !prev)
  }, [setIsArpeggiate])

  const handleOpenHistory = useCallback(() => {
    setIsHistoryOpen(true)
  }, [])

  const handleCloseHistory = useCallback(() => {
    setIsHistoryOpen(false)
  }, [])

  const handlePlayAgain = useCallback(() => {
    reset()
  }, [reset])

  const attemptsUsed = getAttemptsUsed(guesses)
  const isLoss = status === 'loss'
  const endStateMessage = getEndStateMessage(status)
  const shouldShowTarget = shouldRevealTarget(status)
  const revealedTargetByIndex = useMemo(() => {
    return target.map((_, index) => {
      if (shouldShowTarget) {
        return true
      }

      return guesses.some(guess => guess.status[index] === 'correct')
    })
  }, [guesses, shouldShowTarget, target])

  const hintText = `${hintProgress}/2`
  const hintButtonLabel = `Reveal Hint`

  const historyRows = useMemo(() => {
    if (!puzzleDates.length) {
      return <Text c="dimmed">No daily puzzles available.</Text>
    }

    return puzzleDates.map((date) => {
      const entry = historyEntries[date]
      const completedLabel = entry?.completed ? 'Complete' : 'Incomplete'
      const completedAt = entry?.completedAt ? new Date(entry.completedAt).toLocaleString() : null

      return (
        <Card key={date} withBorder>
          <Group justify="space-between" align="center">
            <Group gap="xs" align="center">
              <Text fw={600}>{date}</Text>
              {date === todayDate && <Badge color="blue">Today</Badge>}
            </Group>
            <Badge color={entry?.completed ? 'green' : 'gray'}>{completedLabel}</Badge>
          </Group>
          {(entry?.completed || typeof entry?.hintsUsed === 'number') && (
            <Stack gap={2} mt="xs">
              {typeof entry.attemptsUsed === 'number' && (
                <Text size="sm" c="dimmed">
                  {`Attempts used: ${entry.attemptsUsed}`}
                </Text>
              )}
              {typeof entry.hintsUsed === 'number' && (
                <Text size="sm" c="dimmed">
                  {`Hints used: ${entry.hintsUsed}`}
                </Text>
              )}
              {completedAt && (
                <Text size="sm" c="dimmed">
                  {`Completed at: ${completedAt}`}
                </Text>
              )}
            </Stack>
          )}
        </Card>
      )
    })
  }, [puzzleDates, historyEntries, todayDate])

  const guessesList = useMemo(() => {
    if (!guesses.length) {
      return null
    }

    return (
      guesses.map((guess, index) => (
        <Group key={index} gap="xs" wrap="wrap">
          {guess.chords.map((chord, chordIndex) => (
            <Badge
              key={`${index}-${chord}-${chordIndex}`}
              color={getBadgeColor(guess.status[chordIndex])}
              variant="filled"
              size="lg"
            >
              {chord}
            </Badge>
          ))}
        </Group>
      ))
    )
  }, [guesses])

  const currentList = useMemo(() => {
    if (!current.chords.length) {
      return null
    }

    return (
      <Group gap="xs" wrap="wrap">
        {current.chords.map((chord, index) => (
          <Badge
            key={`${chord}-${index}`}
            color="gray.6"
            variant="outline"
            size="lg"
          >
            {chord}
          </Badge>
        ))}
      </Group>
    )
  }, [current])

  return (
    <Card bdrs="md" p="xl">
      <Card mb="lg" withBorder>
        <DailyPuzzle date={todayDate} onOpenHistory={handleOpenHistory} />
      </Card>
      <Card mb="lg" withBorder>
        <PlaybackControls
          onPlay={handleClickPlay}
          onStop={handleClickStop}
          isLooping={isLooping}
          onToggleLooping={handleToggleLooping}
          isArpeggiate={isArpeggiate}
          onToggleArpeggiate={handleToggleArpeggiate}
        />
      </Card>
      <Group grow align="stretch">
        <Card mb="lg" withBorder>
          <Hints
            onRevealHint={revealHint}
            label={hintButtonLabel}
            text={hintText}
          />
        </Card>
        <Card mb="lg" withBorder>
          <Streak value={currentStreak} />
        </Card>
      </Group>
      {isGameOver && endStateMessage && (
        <Alert mb="lg" color={isLoss ? 'red' : 'green'} title={isLoss ? 'Run complete: Loss' : 'Run complete: Win'} role="status">
          <Stack gap="xs">
            <Text>{endStateMessage}</Text>
            <Text>{`Attempts used: ${attemptsUsed}/${maxGuesses}`}</Text>
            {isLoss && (
              <Text>{`Target progression: ${getLossTargetLabel(target)}`}</Text>
            )}
            <Text c="dimmed">Playback controls remain available for listening.</Text>
            <Group>
              <Button onClick={handlePlayAgain} variant="light">
                Play Again
              </Button>
            </Group>
          </Stack>
        </Alert>
      )}
      <Card mb="lg" withBorder>
        <Text>{`Puzzle Name: ${activePuzzle.name}`}</Text>
        <Divider my="md" />
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
      <Card withBorder>
        <Stack>
          {guessesList}
          {currentList}
        </Stack>
      </Card>
      <Modal
        opened={isHistoryOpen}
        onClose={handleCloseHistory}
        title="Puzzle History"
        closeOnEscape
        centered
      >
        <Stack>
          {historyRows}
        </Stack>
      </Modal>
    </Card>
  )
}

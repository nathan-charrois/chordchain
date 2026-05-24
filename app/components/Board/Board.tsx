import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Checkbox, Divider, Group, Modal, Stack, Text } from '@mantine/core'

import type { GuessStatus } from '../Game/context/GameContext'
import { useGame } from '../Game/hooks/useGame'
import {
  getAttemptsUsed,
  getEndStateMessage,
  getLossTargetLabel,
  shouldRevealTarget,
} from '../Game/logic/session'
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
    maxLength,
    maxGuesses,
    isGameOver,
    activePuzzle,
    todayDate,
    currentStreak,
    puzzleDates,
    historyEntries,
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
  const activeHistoryEntry = historyEntries[activePuzzle.date]
  const activeHistoryLabel = activeHistoryEntry?.completed ? 'Complete' : 'Incomplete'
  const activeCompletedAt = activeHistoryEntry?.completedAt
    ? new Date(activeHistoryEntry.completedAt).toLocaleString()
    : null

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
          {entry?.completed && (
            <Stack gap={2} mt="xs">
              {typeof entry.attemptsUsed === 'number' && (
                <Text size="sm" c="dimmed">
                  {`Attempts used: ${entry.attemptsUsed}`}
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
      return <Text>No guesses</Text>
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
      return <Text>No current guess</Text>
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
      <Stack>
        <Group>
          <Button onClick={handleClickPlay}>Play</Button>
          <Button onClick={handleClickStop}>Stop</Button>
          <Button variant="light" onClick={handleOpenHistory}>Puzzle History</Button>
          <Checkbox label="Loop" checked={isLooping} onChange={handleToggleLooping} />
          <Checkbox label="Arpeggiate" checked={isArpeggiate} onChange={handleToggleArpeggiate} />
        </Group>
        <Group wrap="wrap" gap="sm">
          <Text>{`Status: ${status}`}</Text>
          <Text>{`Puzzle Date: ${activePuzzle.date}`}</Text>
          <Text>{`Puzzle Name: ${activePuzzle.name}`}</Text>
          <Text>{`Current Streak: ${currentStreak}`}</Text>
          <Badge color={activeHistoryEntry?.completed ? 'green' : 'gray'}>
            {`Today's puzzle: ${activeHistoryLabel}`}
          </Badge>
          {activeHistoryEntry?.completed && typeof activeHistoryEntry.attemptsUsed === 'number' && (
            <Text c="dimmed">{`Attempts used: ${activeHistoryEntry.attemptsUsed}`}</Text>
          )}
          {activeCompletedAt && (
            <Text c="dimmed">{`Completed at: ${activeCompletedAt}`}</Text>
          )}
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
        </Group>
        {isGameOver && endStateMessage && (
          <Alert color={isLoss ? 'red' : 'green'} title={isLoss ? 'Run complete: Loss' : 'Run complete: Win'} role="status">
            <Stack gap="xs">
              <Text>{endStateMessage}</Text>
              <Text>{`Attempts used: ${attemptsUsed}/${maxGuesses}`}</Text>
              {isLoss && (
                <Text>{`Target progression: ${getLossTargetLabel(target)}`}</Text>
              )}
              <Text c="dimmed">Playback controls remain available for listening.</Text>
            </Stack>
          </Alert>
        )}
        <Divider />
        <Group>
          {currentList}
        </Group>
        <Divider />
        <Stack>
          {guessesList}
        </Stack>
        <Divider />
        <Group>
          <Text>{`Guess #: ${guesses.length}`}</Text>
          <Text>{`Chain Length: ${maxLength}`}</Text>
          <Text>{`Max Guesses: ${maxGuesses}`}</Text>
        </Group>
      </Stack>
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

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Divider, Group, Modal, Stack, Text } from '@mantine/core'

import type { GuessStatus } from '../Game/context/GameContext'
import { useGame } from '../Game/hooks/useGame'
import { buildGuessRows, type GuessRow } from '../Game/logic/game'
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
    activePuzzle,
    todayDate,
    selectedPuzzleDate,
    currentStreak,
    puzzleDates,
    historyEntries,
    hintProgress,
    revealHint,
    reset,
    selectPuzzleDate,
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

  const handleSelectHistoryPuzzle = useCallback((date: string) => {
    stop()
    selectPuzzleDate(date)
    setIsHistoryOpen(false)
  }, [selectPuzzleDate, stop])

  const attemptsUsed = getAttemptsUsed(guesses)
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
      const isCompleted = entry?.completed === true
      const isSelected = date === selectedPuzzleDate
      const actionLabel = isSelected
        ? isCompleted ? 'Viewing' : 'Playing'
        : isCompleted ? 'View' : 'Play'

      return (
        <Card key={date} withBorder>
          <Group justify="space-between" align="center">
            <Group gap="xs" align="center">
              <Text fw={600}>{date}</Text>
              {date === todayDate && <Badge color="blue">Today</Badge>}
              {isSelected && <Badge color="violet">Current</Badge>}
            </Group>
            <Group gap="xs">
              <Badge color={isCompleted ? 'green' : 'gray'}>{completedLabel}</Badge>
              <Button
                size="xs"
                variant={isSelected ? 'light' : 'outline'}
                disabled={isSelected}
                onClick={() => handleSelectHistoryPuzzle(date)}
              >
                {actionLabel}
              </Button>
            </Group>
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
  }, [puzzleDates, historyEntries, todayDate, selectedPuzzleDate, handleSelectHistoryPuzzle])

  const guessRows = useMemo(() => {
    return buildGuessRows({
      guesses,
      current,
      status,
      maxGuesses,
    })
  }, [guesses, current, status, maxGuesses])

  return (
    <Card bdrs="md" p="xl">
      <Card mb="lg" withBorder>
        <DailyPuzzle
          date={activePuzzle.date}
          isHistorical={activePuzzle.date !== todayDate}
          onOpenHistory={handleOpenHistory}
        />
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
            {isLoss
              ? (
                  <Group>
                    <Button onClick={handlePlayAgain} variant="light">
                      Play Again
                    </Button>
                  </Group>
                )
              : (
                  <Text c="dimmed">This puzzle is complete.</Text>
                )}
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

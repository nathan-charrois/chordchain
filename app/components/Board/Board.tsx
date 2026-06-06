import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
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
import { DEFAULT_TEMPO_BPM } from '~/utils/chain'
import { getPuzzlePathForDate, resolveDailyPuzzle } from '~/utils/dailyPuzzle'
import { formatDisplayDate, formatDisplayDateTime } from '~/utils/date'

const TEMPO_PLAYBACK_RESTART_DELAY_MS = 300

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
    selectPuzzleDate,
  } = useGame()
  const { target, activeIndex, isPlaying, play, stop, setLooping } = useSequence()
  const navigate = useNavigate()

  const [isLooping, setIsLooping] = useState(true)
  const [isArpeggiate, setIsArpeggiate] = useState(false)
  const [tempoBpm, setTempoBpm] = useState(DEFAULT_TEMPO_BPM)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const tempoRestartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearPendingTempoRestart = useCallback(() => {
    if (!tempoRestartTimeoutRef.current) {
      return
    }

    clearTimeout(tempoRestartTimeoutRef.current)
    tempoRestartTimeoutRef.current = null
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      clearPendingTempoRestart()
    }
  }, [isPlaying, clearPendingTempoRestart])

  useEffect(() => clearPendingTempoRestart, [clearPendingTempoRestart])

  const handleTogglePlayback = useCallback(() => {
    if (isPlaying) {
      clearPendingTempoRestart()
      stop()
      return
    }

    play(isArpeggiate, isLooping, tempoBpm)
  }, [isPlaying, clearPendingTempoRestart, stop, play, isLooping, isArpeggiate, tempoBpm])

  const handleToggleLooping = useCallback(() => {
    const nextIsLooping = !isLooping

    setIsLooping(nextIsLooping)
    setLooping(nextIsLooping)
  }, [isLooping, setLooping])

  const handleToggleArpeggiate = useCallback(() => {
    const nextIsArpeggiate = !isArpeggiate

    setIsArpeggiate(nextIsArpeggiate)

    if (isPlaying) {
      clearPendingTempoRestart()
      play(nextIsArpeggiate, isLooping, tempoBpm)
    }
  }, [isArpeggiate, isPlaying, clearPendingTempoRestart, play, isLooping, tempoBpm])

  const handleTempoChange = useCallback((nextTempoBpm: number) => {
    setTempoBpm(nextTempoBpm)

    if (isPlaying) {
      clearPendingTempoRestart()
      tempoRestartTimeoutRef.current = setTimeout(() => {
        tempoRestartTimeoutRef.current = null
        play(isArpeggiate, isLooping, nextTempoBpm)
      }, TEMPO_PLAYBACK_RESTART_DELAY_MS)
    }
  }, [isPlaying, clearPendingTempoRestart, play, isLooping, isArpeggiate])

  const handleOpenHistory = useCallback(() => {
    setIsHistoryOpen(true)
  }, [])

  const handleCloseHistory = useCallback(() => {
    setIsHistoryOpen(false)
  }, [])

  const handleSelectHistoryPuzzle = useCallback((date: string) => {
    clearPendingTempoRestart()
    stop()
    navigate(getPuzzlePathForDate(date))
    selectPuzzleDate(date)
    setIsHistoryOpen(false)
  }, [clearPendingTempoRestart, navigate, selectPuzzleDate, stop])

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
      const puzzle = resolveDailyPuzzle(date)
      const completedAt = entry?.completedAt ? formatDisplayDateTime(entry.completedAt) : null
      const failedAt = entry?.failedAt ? formatDisplayDateTime(entry.failedAt) : null
      const isCompleted = entry?.completed === true
      const isFailed = entry?.failed === true
      const isSelected = date === selectedPuzzleDate
      const actionLabel = isSelected
        ? isCompleted || isFailed ? 'Viewing' : 'Playing'
        : isCompleted || isFailed ? 'View' : 'Play'
      const statusLabel = isFailed ? 'Failed' : isCompleted ? 'Complete' : 'Incomplete'
      const statusColor = isFailed ? 'red' : isCompleted ? 'green' : 'gray'

      return (
        <Card key={date} withBorder>
          <Stack gap="sm">
            <Stack gap={2}>
              <Group gap="xs" justify="space-between">
                <Text fw={700}>{puzzle.name}</Text>
                {date === todayDate && <Badge color="blue">Today's Puzzle</Badge>}
              </Group>
              <Text size="sm" c="dimmed">{formatDisplayDate(date)}</Text>
            </Stack>

            <Group gap="xs">
              <Badge color="cyan" variant="outline">{puzzle.difficulty}</Badge>
              <Badge color={statusColor} variant="outline">{statusLabel}</Badge>
            </Group>

            {(entry?.completed || entry?.failed || typeof entry?.hintsUsed === 'number') && (
              <Stack gap={2}>
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
                {failedAt && (
                  <Text size="sm" c="dimmed">
                    {`Failed at: ${failedAt}`}
                  </Text>
                )}
              </Stack>
            )}

            <Button
              size="xs"
              variant={isSelected ? 'light' : 'outline'}
              disabled={isSelected}
              onClick={() => handleSelectHistoryPuzzle(date)}
            >
              {actionLabel}
            </Button>
          </Stack>
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
        <Stack gap={2}>
          <Text>{`Puzzle Name: ${activePuzzle.name}`}</Text>
          <Text c="dimmed">{`Difficulty: ${activePuzzle.difficulty}`}</Text>
        </Stack>
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

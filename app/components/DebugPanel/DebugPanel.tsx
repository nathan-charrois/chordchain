import { useMemo, useState } from 'react'
import { Badge, Box, Button, Group, Paper, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import {
  buildChord,
  buildChords,
  buildPaletteChordIds,
  buildScale,
} from '~/utils/music'

export default function DebugPanel() {
  const {
    activePuzzle,
    status,
    guesses,
    maxGuesses,
    historyEntries,
    resetToday,
  } = useGame()

  const [isExpanded, setIsExpanded] = useState(false)

  const historyEntry = historyEntries[activePuzzle.date]
  const puzzleDefinition = useMemo(() => ({
    date: activePuzzle.date,
    name: activePuzzle.name,
    arpeggiateType: activePuzzle.arpeggiateType,
    key: activePuzzle.key,
    mode: activePuzzle.mode,
    difficulty: activePuzzle.difficulty,
    progression: activePuzzle.progression,
  }), [activePuzzle])
  const puzzleMusic = useMemo(() => {
    const scale = buildScale(activePuzzle.key, activePuzzle.mode)
    const progression = buildChords(
      activePuzzle.key,
      activePuzzle.mode,
      activePuzzle.progression,
    )
    const paletteChordIds = buildPaletteChordIds(activePuzzle.difficulty)

    return {
      scale,
      progression,
      palette: {
        triad: paletteChordIds.triad.map(chord => buildChord(scale, chord)),
        seventh: paletteChordIds.seventh.map(chord => buildChord(scale, chord)),
        extension: paletteChordIds.extension.map(chord => buildChord(scale, chord)),
      },
    }
  }, [activePuzzle])

  return (
    <Box
      style={{
        position: 'fixed',
        top: 20,
        right: 0,
        zIndex: 200,
        maxWidth: 'calc(100vw - 24px)',
      }}
    >
      <Group justify="flex-end" mb="xs">
        <Button
          size="xs"
          variant={isExpanded ? 'filled' : 'light'}
          onClick={() => setIsExpanded(prev => !prev)}
        >
          Debug
        </Button>
      </Group>

      {isExpanded && (
        <Paper
          withBorder
          radius="md"
          shadow="md"
          p="sm"
          style={{
            width: 'min(340px, calc(100vw - 24px))',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
            backgroundColor: 'var(--mantine-color-body)',
          }}
        >
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Text fw={700} size="sm">Debug Panel</Text>
              <Badge color="gray" variant="light">Dev</Badge>
            </Group>

            <Text fw={600} size="sm" mt="xs">Puzzle Definition</Text>
            <Box component="pre" m={0} fz="xs" style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(puzzleDefinition, null, 2)}
            </Box>

            <Text fw={600} size="sm" mt="xs">Puzzle Music</Text>
            <Box component="pre" m={0} fz="xs" style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(puzzleMusic, null, 2)}
            </Box>

            <Text fw={600} size="sm" mt="xs">Live Game</Text>
            <Text size="sm">{`Status: ${status}`}</Text>
            <Text size="sm">{`Guesses: ${guesses.length}/${maxGuesses}`}</Text>

            <Text fw={600} size="sm" mt="xs">Today History</Text>
            <Text size="sm">{`Completed: ${historyEntry?.completed ? 'true' : 'false'}`}</Text>
            <Text size="sm">{`Attempts used: ${historyEntry?.attemptsUsed ?? 'n/a'}`}</Text>
            <Text size="sm">{`Completed at: ${historyEntry?.completedAt ?? 'n/a'}`}</Text>

            <Button
              color="red"
              variant="light"
              onClick={() => {
                resetToday()
              }}
            >
              Reset Today
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

import { useMemo, useState } from 'react'
import { Badge, Box, Button, Group, Paper, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { formatModeLabel } from '~/utils/music'

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
  const targetLabel = useMemo(() => activePuzzle.target.join(' -> '), [activePuzzle.target])

  return (
    <Box
      style={{
        position: 'fixed',
        top: 202,
        right: 12,
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
          {isExpanded ? 'Hide Debug' : 'Show Debug'}
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

            <Text size="sm">{`Date: ${activePuzzle.date}`}</Text>
            <Text size="sm">{`Key: ${activePuzzle.key}`}</Text>
            <Text size="sm">{`Mode: ${formatModeLabel(activePuzzle.mode)}`}</Text>
            <Text size="sm">{`Target: ${targetLabel}`}</Text>
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

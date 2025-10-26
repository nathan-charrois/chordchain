import { useMemo } from 'react'
import { Button, Card, Checkbox, Divider, Group, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'

export default function Board() {
  const { status, target, guesses, maxLength, maxGuesses } = useGame()

  const guessesList = useMemo(() => (
    guesses.map((guess, index) => (
      <Text key={index}>{guess.chords}</Text>
    ))
  ), [guesses])

  return (
    <Card bdrs="md" p="xl">
      <Stack>
        <Group>
          <Text>{`Status: ${status}`}</Text>
          <Text>{`Target: ${target}`}</Text>
        </Group>
        <Divider />
        <Group>
          <Button>Play</Button>
          <Checkbox label="Loop" />
          <Checkbox label="Arp" />
        </Group>
        <Divider />
        <Group>
          {guesses.length
            ? guessesList
            : <Text>No guesses yet</Text>}
        </Group>
        <Group>
          <Text>{`Max Length: ${maxLength}`}</Text>
          <Text>{`Max Guesses: ${maxGuesses}`}</Text>
        </Group>
      </Stack>
    </Card>
  )
}

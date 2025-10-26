import { useMemo } from 'react'
import { Button, Card, Checkbox, Divider, Group, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'

export default function Board() {
  const { status, target, guesses, current, maxLength, maxGuesses } = useGame()

  const guessesList = useMemo(() => {
    if (!guesses.length) {
      return <Text>No guesses</Text>
    }

    return (
      guesses.map((guess, index) => (
        <Group key={index}>
          {guess.chords.join(' - ')}
        </Group>
      ))
    )
  }, [guesses])

  const currentList = useMemo(() => {
    if (!current.chords.length) {
      return <Text>No current guess</Text>
    }

    return (
      current.chords.join(' - ')
    )
  }, [current])

  return (
    <Card bdrs="md" p="xl">
      <Stack>
        <Group>
          <Text>{`Status: ${status}`}</Text>
          <Text>{`Target: ${target.join(' - ')}`}</Text>
        </Group>
        <Divider />
        <Group>
          <Button>Play</Button>
          <Checkbox label="Loop" />
          <Checkbox label="Arp" />
        </Group>
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
    </Card>
  )
}

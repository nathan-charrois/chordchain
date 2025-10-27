import { useCallback, useMemo, useState } from 'react'
import { Button, Card, Checkbox, Divider, Group, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { playSequence, stopSequence } from '~/utils/chain'

export default function Board() {
  const { status, target, guesses, current, maxLength, maxGuesses } = useGame()

  const [isLooping, setIsLooping] = useState(true)
  const [isArpeggiate, setIsArpeggiate] = useState(true)

  const handleClickPlay = useCallback(() => {
    playSequence(current.chords, isArpeggiate, isLooping)
  }, [current, isLooping, isArpeggiate])

  const handleClickStop = useCallback(() => {
    stopSequence()
  }, [])

  const handleToggleLooping = useCallback(() => {
    setIsLooping(prev => !prev)
  }, [setIsLooping])

  const handleToggleArpeggiate = useCallback(() => {
    setIsArpeggiate(prev => !prev)
  }, [setIsArpeggiate])

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
          <Button onClick={handleClickPlay}>Play</Button>
          <Button onClick={handleClickStop}>Stop</Button>
          <Checkbox label="Loop" checked={isLooping} onChange={handleToggleLooping} />
          <Checkbox label="Arpeggiate" checked={isArpeggiate} onChange={handleToggleArpeggiate} />
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

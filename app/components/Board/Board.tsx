import { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Checkbox, Divider, Group, Stack, Text } from '@mantine/core'

import { useGame } from '../Game/hooks/useGame'
import { useSequence } from './hooks/useSequence'

export default function Board() {
  const { status, guesses, current, maxLength, maxGuesses } = useGame()
  const { target, activeIndex, play, stop } = useSequence()

  const [isLooping, setIsLooping] = useState(true)
  const [isArpeggiate, setIsArpeggiate] = useState(true)

  useEffect(() => {
    if (!isLooping) {
      stop()
    }
  }, [isLooping, stop])

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
          <Button onClick={handleClickPlay}>Play</Button>
          <Button onClick={handleClickStop}>Stop</Button>
          <Checkbox label="Loop" checked={isLooping} onChange={handleToggleLooping} />
          <Checkbox label="Arpeggiate" checked={isArpeggiate} onChange={handleToggleArpeggiate} />
        </Group>
        <Group wrap="wrap" gap="sm">
          <Text>{`Status: ${status}`}</Text>
          <Group gap="xs">
            <Text>Target:</Text>
            {target.map((chord, index) => (
              <Badge
                key={`${chord}-${index}`}
                color={index === activeIndex ? 'lime.6' : 'gray.6'}
                variant={index === activeIndex ? 'filled' : 'light'}
              >
                {chord}
              </Badge>
            ))}
          </Group>
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

import { useCallback, useState } from 'react'
import { Cards01Icon } from '@hugeicons/core-free-icons'
import { Modal, Text } from '@mantine/core'

import Icon from '~/components/Icon/Icon'
import { useIsMobile } from '~/hooks/useIsMobile'

export default function About() {
  const isMobile = useIsMobile()

  const [isOpen, setIsOpen] = useState(false)

  const handleOnClick = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleOnClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <>
      <Icon label="About" icon={Cards01Icon} onClick={handleOnClick} compact={isMobile} />
      <Modal
        opened={isOpen}
        onClose={handleOnClose}
        title="About"
        closeOnEscape
        centered
      >
        <Text c="dimmed" pb="md">
          Chord Chain is a daily ear-training puzzle where you guess a hidden chord progression by listening.
        </Text>
        <Text pb="sm">
          How to play
        </Text>
        <Text c="dimmed" pb="sm">
          Listen to the daily progression and choose chords that recreate what you hear.
        </Text>
        <Text c="dimmed" pb="md">
          Submit your chain to get feedback on each chord. Use the feedback to adjust your next guess.
        </Text>
        <Text pb="sm">
          Feedback
        </Text>
        <Text c="dimmed" pb="sm">
          After each guess, every chord receives inline feedback to show how close it is to the answer.
        </Text>
        <Text c="dimmed" pb="sm">
          A chord may match exactly, share the right harmonic role, move in the right direction, or miss the target entirely.
        </Text>
        <Text c="dimmed">
          Submitted guesses can be played back, so you can compare your previous chains against the daily progression.
        </Text>
      </Modal>
    </>
  )
}

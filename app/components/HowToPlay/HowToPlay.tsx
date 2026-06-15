import { useCallback, useState } from 'react'
import { HelpCircleIcon } from '@hugeicons/core-free-icons'
import { Modal, Text } from '@mantine/core'

import Icon from '~/components/Icon/Icon'

export default function HowToPlay() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOnClick = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleOnClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <>
      <Icon label="How to Play" icon={HelpCircleIcon} onClick={handleOnClick} />
      <Modal
        opened={isOpen}
        onClose={handleOnClose}
        title="How to Play"
        closeOnEscape
        centered
      >
        <Text>
          Chord Chain is an ear training game. Use the onscreen keyboard and select chords from the chord pallette. Then press "Enter" for the chain to be evaluated.
        </Text>
      </Modal>
    </>
  )
}

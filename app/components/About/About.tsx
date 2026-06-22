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
        <Text>
          Chord Chain is an ear training game. Use the onscreen keyboard and select chords from the chord pallette. Then press "Enter" for the chain to be evaluated.
        </Text>
      </Modal>
    </>
  )
}

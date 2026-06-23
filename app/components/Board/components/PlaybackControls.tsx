import { useCallback, useMemo, useState } from 'react'
import { PauseIcon, PlayIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Checkbox, Collapse, Flex, Group, Slider, Text } from '@mantine/core'

import PlaybackControlsButton from './PlaybackControlsButton'
import { useIsTablet } from '~/hooks/useIsTablet'

type PlaybackControlsProps = {
  isPlaying: boolean
  onTogglePlayback: () => void
  tempoBpm: number
  onTempoChange: (tempoBpm: number) => void
  isArpeggiate: boolean
  onToggleArpeggiate: () => void
  isDrumsEnabled: boolean
  onToggleDrums: () => void
  settingsDisabled?: boolean
}

export default function PlaybackControls({
  isPlaying,
  onTogglePlayback,
  tempoBpm,
  onTempoChange,
  isArpeggiate,
  onToggleArpeggiate,
  isDrumsEnabled,
  onToggleDrums,
  settingsDisabled = false,
}: PlaybackControlsProps) {
  const isTablet = useIsTablet()

  const [areControlsOpen, setAreControlsOpen] = useState(false)

  const leftSection = useMemo(() => {
    if (isPlaying) {
      return <HugeiconsIcon icon={PauseIcon} aria-label="Pause" />
    }

    return <HugeiconsIcon icon={PlayIcon} aria-label="Play" />
  }, [isPlaying])

  const handleToggleControls = useCallback(() => {
    setAreControlsOpen(current => !current)
  }, [])

  const toggleButtons = useMemo(() => {
    return (
      <Flex direction="row" gap="md">
        <Checkbox label="Arpeggiate" checked={isArpeggiate} onChange={onToggleArpeggiate} disabled={settingsDisabled} />
        <Checkbox label="Drums" checked={isDrumsEnabled} onChange={onToggleDrums} disabled={settingsDisabled} />
      </Flex>
    )
  }, [isArpeggiate, onToggleArpeggiate, isDrumsEnabled, onToggleDrums, settingsDisabled])

  const tempoSlider = useMemo(() => {
    return (
      <Flex gap="md" align="center" w="100%">
        <Slider
          aria-label="Tempo"
          min={10}
          flex={1}
          max={160}
          step={1}
          value={tempoBpm}
          onChange={onTempoChange}
          disabled={settingsDisabled}
        />
        <Flex justify="space-between" align="center" miw={55}>
          <Text size="sm">{`${tempoBpm} BPM`}</Text>
        </Flex>
      </Flex>
    )
  }, [tempoBpm, onTempoChange, settingsDisabled])

  if (isTablet) {
    return (
      <Flex direction="column" gap="md">
        <Flex align="center" gap="sm">
          <Button
            size="lg"
            radius="md"
            leftSection={leftSection}
            onClick={onTogglePlayback}
            disabled={settingsDisabled}
            flex={1}
          >
            {isPlaying ? 'Stop' : 'Play'}
          </Button>
          <PlaybackControlsButton opened={areControlsOpen} onClick={handleToggleControls} />
        </Flex>
        <Collapse in={areControlsOpen}>
          <Flex direction="column" bdrs="md" p="sm" px="sm" gap="lg">
            {toggleButtons}
            {tempoSlider}
          </Flex>
        </Collapse>
      </Flex>
    )
  }

  return (
    <Flex align="stretch">
      <Group flex={5} align="center">
        <Button
          size="lg"
          radius="md"
          mr="sm"
          leftSection={leftSection}
          onClick={onTogglePlayback}
          disabled={settingsDisabled}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
        {toggleButtons}
      </Group>
      <Flex flex={4} align="center">
        {tempoSlider}
      </Flex>
    </Flex>
  )
}

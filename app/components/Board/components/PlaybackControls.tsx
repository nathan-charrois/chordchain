import { useMemo } from 'react'
import { PauseIcon, PlayIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Checkbox, Group, Slider, Text } from '@mantine/core'

type PlaybackControlsProps = {
  isPlaying: boolean
  onTogglePlayback: () => void
  tempoBpm: number
  onTempoChange: (tempoBpm: number) => void
  isArpeggiate: boolean
  onToggleArpeggiate: () => void
  isDrumsEnabled: boolean
  onToggleDrums: () => void
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
}: PlaybackControlsProps) {
  const leftSection = useMemo(() => {
    if (isPlaying) {
      return <HugeiconsIcon icon={PauseIcon} aria-label="Pause" />
    }

    return <HugeiconsIcon icon={PlayIcon} aria-label="Play" />
  }, [isPlaying])

  return (
    <Group>
      <Group flex="8">
        <Button size="lg" mr="sm" radius="md" leftSection={leftSection} onClick={onTogglePlayback}>
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
        <Checkbox label="Arpeggiate" checked={isArpeggiate} onChange={onToggleArpeggiate} />
        <Checkbox label="Drums" checked={isDrumsEnabled} onChange={onToggleDrums} />
      </Group>
      <Group flex="6" justify="flex-end" gap="md">
        <Text size="sm">
          Tempo
        </Text>
        <Slider
          flex={1}
          aria-label="Tempo"
          min={10}
          max={160}
          step={1}
          value={tempoBpm}
          onChange={onTempoChange}
        />
        <Text size="sm" w={60}>
          {`${tempoBpm} BPM`}
        </Text>
      </Group>
    </Group>
  )
}

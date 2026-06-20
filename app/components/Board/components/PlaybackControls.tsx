import { useMemo } from 'react'
import { PauseIcon, PlayIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Checkbox, Group, Slider, Text } from '@mantine/core'

type PlaybackControlsProps = {
  isPlaying: boolean
  onTogglePlayback: () => void
  tempoBpm: number
  onTempoChange: (tempoBpm: number) => void
  isLooping: boolean
  onToggleLooping: () => void
  isArpeggiate: boolean
  onToggleArpeggiate: () => void
}

export default function PlaybackControls({
  isPlaying,
  onTogglePlayback,
  tempoBpm,
  onTempoChange,
  isLooping,
  onToggleLooping,
  isArpeggiate,
  onToggleArpeggiate,
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
        <Checkbox label="Loop" checked={isLooping} onChange={onToggleLooping} />
        <Checkbox label="Arpeggiate" checked={isArpeggiate} onChange={onToggleArpeggiate} />
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

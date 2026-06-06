import { Button, Checkbox, Group, Slider, Stack, Text } from '@mantine/core'

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

export function PlaybackControls({
  isPlaying,
  onTogglePlayback,
  tempoBpm,
  onTempoChange,
  isLooping,
  onToggleLooping,
  isArpeggiate,
  onToggleArpeggiate,
}: PlaybackControlsProps) {
  return (
    <Stack gap="md">
      <Group>
        <Button onClick={onTogglePlayback}>{isPlaying ? 'Stop' : 'Play'}</Button>
        <Checkbox label="Loop" checked={isLooping} onChange={onToggleLooping} />
        <Checkbox label="Arpeggiate" checked={isArpeggiate} onChange={onToggleArpeggiate} />
      </Group>
      <Stack gap="xs">
        <Text size="sm" fw={600}>{`Tempo: ${tempoBpm} BPM`}</Text>
        <Slider
          aria-label="Tempo"
          min={60}
          max={200}
          step={5}
          value={tempoBpm}
          onChange={onTempoChange}
        />
      </Stack>
    </Stack>
  )
}

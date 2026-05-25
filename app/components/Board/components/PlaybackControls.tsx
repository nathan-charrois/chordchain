import { Button, Checkbox, Group } from '@mantine/core'

type PlaybackControlsProps = {
  onPlay: () => void
  onStop: () => void
  isLooping: boolean
  onToggleLooping: () => void
  isArpeggiate: boolean
  onToggleArpeggiate: () => void
}

export function PlaybackControls({
  onPlay,
  onStop,
  isLooping,
  onToggleLooping,
  isArpeggiate,
  onToggleArpeggiate,
}: PlaybackControlsProps) {
  return (
    <Group>
      <Button onClick={onPlay}>Play</Button>
      <Button onClick={onStop}>Stop</Button>
      <Checkbox label="Loop" checked={isLooping} onChange={onToggleLooping} />
      <Checkbox label="Arpeggiate" checked={isArpeggiate} onChange={onToggleArpeggiate} />
    </Group>
  )
}

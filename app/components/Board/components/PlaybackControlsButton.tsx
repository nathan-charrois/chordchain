import { Settings02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ActionIcon } from '@mantine/core'

type Props = {
  opened: boolean
  onClick: () => void
}

export default function PlaybackControlsButton({ opened, onClick }: Props) {
  return (
    <ActionIcon
      aria-label="Playback controls"
      aria-pressed={opened}
      variant={opened ? 'filled' : 'light'}
      size={50}
      radius="md"
      onClick={onClick}
    >
      <HugeiconsIcon icon={Settings02Icon} />
    </ActionIcon>
  )
}

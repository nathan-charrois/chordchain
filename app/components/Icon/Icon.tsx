import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Button, Stack, Text } from '@mantine/core'

type IconProps = {
  label: string
  icon: IconSvgElement
  onClick: () => void
}

export default function Icon({ onClick, label, icon }: IconProps) {
  return (
    <Button variant="transparent" onClick={onClick} h="auto" size="compact-sm">
      <Stack align="center" gap={5}>
        <HugeiconsIcon icon={icon} aria-label={label} />
        <Text>{label}</Text>
      </Stack>
    </Button>
  )
}

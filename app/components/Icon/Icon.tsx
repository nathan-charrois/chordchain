import { useMemo } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Button, Stack, Text } from '@mantine/core'

type IconProps = {
  label?: string
  icon: IconSvgElement
  onClick?: () => void
  size?: string | number
}

export default function Icon({ onClick, label, icon, size }: IconProps) {
  const content = useMemo(() => ((
    <>
      <HugeiconsIcon icon={icon} aria-label={label} size={size} />
      {label && (
        <Text c="dark.8">
          {label}
        </Text>
      )}
    </>
  )), [icon, label, size])

  if (onClick) {
    return (
      <Button variant="transparent" onClick={onClick} h="105" w="95">
        <Stack align="center" gap={8}>
          {content}
        </Stack>
      </Button>
    )
  }

  return content
}

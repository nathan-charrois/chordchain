import { useMemo } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Button, Stack, Text } from '@mantine/core'

type IconProps = {
  label?: string
  icon: IconSvgElement
  onClick?: () => void
  size?: string | number
  compact?: boolean
}

export default function Icon({
  onClick,
  label,
  icon,
  size,
  compact = false,
}: IconProps) {
  const content = useMemo(() => ((
    <>
      <HugeiconsIcon icon={icon} aria-label={label} size={size} />
      {label && !compact && (
        <Text c="dark.8">
          {label}
        </Text>
      )}
    </>
  )), [icon, label, compact, size])

  if (onClick) {
    return (
      <Button
        aria-label={label}
        variant="transparent"
        onClick={onClick}
        h="auto"
        py={compact ? 'xs' : 'md'}
        px={compact ? 'sm' : 'lg'}
      >
        <Stack align="center" gap={8}>
          {content}
        </Stack>
      </Button>
    )
  }

  return content
}

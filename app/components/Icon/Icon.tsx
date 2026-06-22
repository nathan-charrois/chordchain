import { useMemo } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Button, Stack, Text } from '@mantine/core'

type IconProps = {
  label?: string
  icon: IconSvgElement
  onClick?: () => void
  size?: string | number
  compact?: boolean
  color?: string
}

export default function Icon({
  onClick,
  label,
  icon,
  size,
  compact = false,
  color,
}: IconProps) {
  const content = useMemo(() => ((
    <Stack c={color} align="center" gap="xs">
      <HugeiconsIcon icon={icon} aria-label={label} size={size} color="inherit" />
      {label && !compact && (
        <Text c="dark.8">
          {label}
        </Text>
      )}
    </Stack>
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
        {content}
      </Button>
    )
  }

  return content
}

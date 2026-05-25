import { Stack, Text } from '@mantine/core'

type HintsProps = {
  label: string
  text: string
  onRevealHint: () => void
}

export function Hints({ label, text, onRevealHint }: HintsProps) {
  return (
    <Stack gap={2}>
      <Text fw={700}>{text}</Text>
      <Text size="sm" onClick={onRevealHint} c="dimmed">{label}</Text>
    </Stack>
  )
}

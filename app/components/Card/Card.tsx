import { Card as MantineCard, type CardProps as MantineCardProps } from '@mantine/core'

type CardProps = {
  children: React.ReactNode
}

export default function Card({
  children,
  ...props
}: MantineCardProps & CardProps,
) {
  return (
    <MantineCard {...props}>
      {children}
    </MantineCard>
  )
}

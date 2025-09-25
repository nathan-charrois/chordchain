import { MantineProvider } from '@mantine/core'

type Props = {
  children: React.ReactNode
}

export default function AppProvider({ children }: Props) {
  return (
    <MantineProvider>
      {children}
    </MantineProvider>
  )
}

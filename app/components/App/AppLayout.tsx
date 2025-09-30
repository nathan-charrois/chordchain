import { AppShell, Center } from '@mantine/core'

type Props = {
  header: React.ReactNode
  children: React.ReactNode
}

export default function AppLayout({ header, children }: Props) {
  return (
    <Center>
      <AppShell withBorder={false} offsetScrollbars={false}>
        <AppShell.Main>
          <Center w="100%">
            {header}
          </Center>
          <Center w="100%">
            {children}
          </Center>
        </AppShell.Main>

      </AppShell>
    </Center>
  )
}

import { AppShell, Center } from '@mantine/core'

type Props = {
  header: React.ReactNode
  children: React.ReactNode
}

export default function AppLayout({ header, children }: Props) {
  return (
    <AppShell withBorder={false} header={{ height: 60 }}>
      <AppShell.Header>
        <Center>
          {header}
        </Center>
      </AppShell.Header>
      <AppShell.Main>
        <Center>
          {children}
        </Center>
      </AppShell.Main>
    </AppShell>
  )
}

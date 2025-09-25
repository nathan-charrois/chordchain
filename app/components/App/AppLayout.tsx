import { AppShell } from '@mantine/core'

type Props = {
  header: React.ReactNode
  children: React.ReactNode
}

export default function AppLayout({ header, children }: Props) {
  return (
    <AppShell withBorder={false} header={{ height: 60 }}>
      <AppShell.Header>
        {header}
      </AppShell.Header>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  )
}

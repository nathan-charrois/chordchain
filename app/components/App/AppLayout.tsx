import { AppShell, Center } from '@mantine/core'

import DebugPanel from '~/components/DebugPanel/DebugPanel'
import Footer from '~/components/Footer/Footer'
import Header from '~/components/Header/Header'

type Props = {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <Center>
      <AppShell withBorder={false} offsetScrollbars={false}>
        <AppShell.Main>
          <DebugPanel />
          <Header />
          {children}
          <Footer />
        </AppShell.Main>
      </AppShell>
    </Center>
  )
}

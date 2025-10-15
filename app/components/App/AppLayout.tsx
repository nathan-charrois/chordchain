import { AppShell, Center } from '@mantine/core'

import Footer from '../Footer/Footer'
import Header from '../Header/Header'

type Props = {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <Center>
      <AppShell withBorder={false} offsetScrollbars={false}>
        <AppShell.Main>
          <Center w="100%">
            <Header />
          </Center>
          <Center w="100%">
            {children}
          </Center>
          <Center w="100%">
            <Footer />
          </Center>
        </AppShell.Main>
      </AppShell>
    </Center>
  )
}

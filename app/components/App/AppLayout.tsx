import { Container } from '@mantine/core'

import DebugPanel from '~/components/DebugPanel/DebugPanel'
import Footer from '~/components/Footer/Footer'
import Header from '~/components/Header/Header'
import { responsiveSizing } from '~/constant'

type Props = {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <Container size="lg" px={responsiveSizing}>
      <Header />
      {children}
      <Footer />
      <DebugPanel />
    </Container>
  )
}

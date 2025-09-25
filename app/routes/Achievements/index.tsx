import type { MetaArgs } from 'react-router'

import AppLayout from '~/components/App/AppLayout'
import AppProvider from '~/components/App/AppProvider'
import Header from '~/components/Header/Header'

export function meta({}: MetaArgs) {
  return [
    { title: 'Mathler - Achievements' },
  ]
}

export default function Game() {
  return (
    <AppProvider>
      <AppLayout header={<Header />}>
        Achievements
      </AppLayout>
    </AppProvider>
  )
}

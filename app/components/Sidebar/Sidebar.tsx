import { Stack } from '@mantine/core'

import SidebarCalendar from '~/components/Sidebar/components/SidebarCalendar'
import SidebarDetails from '~/components/Sidebar/components/SidebarDetails'
import { useIsTablet } from '~/hooks/useIsTablet'

export default function Sidebar() {
  const isTablet = useIsTablet()

  return (
    <Stack gap="md">
      <SidebarCalendar />
      {!isTablet && <SidebarDetails />}
    </Stack>
  )
}

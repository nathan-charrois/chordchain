import { Stack } from '@mantine/core'

import SidebarCalendar from '~/components/Sidebar/components/SidebarCalendar'
import SidebarDetails from '~/components/Sidebar/components/SidebarDetails'

export default function Sidebar() {
  return (
    <Stack gap="md">
      <SidebarCalendar />
      <SidebarDetails />
    </Stack>
  )
}

import { Stack } from '@mantine/core'

import SidebarCalendar from '~/components/Sidebar/components/SidebarCalendar'
import SidebarDetails from '~/components/Sidebar/components/SidebarDetails'
import SidebarStreak from '~/components/Sidebar/components/SidebarStreak'

export default function Sidebar() {
  return (
    <Stack gap="md">
      <SidebarCalendar />
      <SidebarStreak />
      <SidebarDetails />
    </Stack>
  )
}

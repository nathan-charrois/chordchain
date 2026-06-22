import { em, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

export function useIsMobile() {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(width < ${em(theme.breakpoints.sm)})`)

  return isMobile
}

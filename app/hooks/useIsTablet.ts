import { useMediaQuery } from '@mantine/hooks'

export function useIsTablet() {
  const isTablet = useMediaQuery('(max-width: 760px)')
  return isTablet
}

import { Text } from '@mantine/core'

import { useGame } from './GameProvider'

export default function GameTarget() {
  const { target } = useGame()
  return (
    <Text>{`Find the hidden calculation that equals ${target}`}</Text>
  )
}

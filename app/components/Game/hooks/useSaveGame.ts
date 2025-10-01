import { useCallback } from 'react'
import { useDynamicContext, useUserUpdateRequest } from '@dynamic-labs/sdk-react-core'

type UserMetadata = {
  games?: Record<string, number>
}

export function useSaveGame() {
  const { updateUser } = useUserUpdateRequest()
  const { user } = useDynamicContext()

  const save = async (target: number) => {
    const ts = Date.now().toString()
    const meta = (user?.metadata as UserMetadata) ?? {}
    const existing = meta.games ?? {}
    const newGames = { ...existing, [ts]: target }

    return await updateUser({
      metadata: {
        ...(user?.metadata ?? {}),
        games: newGames,
      },
    })
  }

  const saveGame = useCallback(async (target: number) => {
    if (!user) {
      return false
    }

    const result = await save(target)

    if (result.updateUserProfileResponse) {
      return true
    }

    return false
  }, [user, save])

  return saveGame
}

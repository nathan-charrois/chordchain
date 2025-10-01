import { useDynamicContext, useUserUpdateRequest } from '@dynamic-labs/sdk-react-core'

export function useSaveGame() {
  const { updateUser } = useUserUpdateRequest()
  const { primaryWallet } = useDynamicContext()

  const save = async () => {
    return await updateUser({
      metadata: {
        games: {
          mathler: '1',
        },
      },
    })
  }

  const saveGame = async () => {
    if (!primaryWallet) {
      return false
    }

    const result = await save()

    if (result.updateUserProfileResponse) {
      return true
    }

    return false
  }

  return saveGame
}

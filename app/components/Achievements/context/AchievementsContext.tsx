import { createContext } from 'react'

export type Achievement = { [key: string]: string }

export type Achievements = {
  achievement: Achievement
}

export const AchievementsContext = createContext<Achievements | undefined>(undefined)

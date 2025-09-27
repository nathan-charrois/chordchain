import { createContext } from 'react'

export type Achievement = {
  title: 'One and done!' | 'Just in time!'
  emoji: '🥇' | '🥈'
}

export type Achievements = {
  achievements: Achievement[]
}

export const AchievementsContext = createContext<Achievements | undefined>(undefined)

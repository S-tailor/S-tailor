import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface userProfile {
  profileName: string
  profilePk: number
  image: string
}

interface User {
  user: userProfile[]
  // profilePk: number | 0
  setUser: (user: userProfile) => void
  clearUsers: () => void
}

const userStore = create(
  persist<User>(
    (set) => ({
      user: [],
      // profilePk: 0,
      setUser: (by) => set(() => ({ user: [by] })),
      clearUsers: () => set({ user: [] })
    }),
    {
      name: 'userIdStorage'
    }
  )
)

export default userStore

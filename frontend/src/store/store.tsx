import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface userProfile {
  profileName: string
  profilePk: number
}

interface User {
  user: userProfile[]
  profilePk: number | 0
  setUser: (user: userProfile) => void
  clearUsers: () => void
  setProfilePk: (pk: number) => void
}

const userStore = create(
  persist<User>(
    (set) => ({
      user: [],
      profilePk: 0,
      setUser: (by) => set(() => ({ user: [by] })),
      clearUsers: () => set({ user: [] }),
      setProfilePk: (profilePk) => set({ profilePk })
    }),
    {
      name: 'userIdStorage'
    }
  )
)

export default userStore

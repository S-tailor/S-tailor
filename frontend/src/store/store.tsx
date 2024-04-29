import { create } from "zustand";
import { persist } from "zustand/middleware";

interface userProfile {
    profileName: string;
}

interface User {
    user: userProfile[]
    setUser: (user: userProfile) => void
    clearUsers: () => void;
  }

  const userStore = create(
  persist<User>(
    (set) => ({
    user: [],
    setUser: (by) => set(() => ({user: [by] })),
    clearUsers: () => set({ user: [] })
    }),
    {
        name: "userIdStorage",
      }
  )
)
    
 

  export default userStore
  

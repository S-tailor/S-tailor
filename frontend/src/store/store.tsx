import { create } from "zustand";
import { persist } from "zustand/middleware";
interface User {
    user: string[];
    setUser: (user: string) => void
    
  }

  const userStore = create(
  persist<User>(
    (set) => ({
    user: [],
    setUser: (by) => set(() => ({user: [by] })),
    }),
    {
        name: "userIdStorage",
      }
  )
)
    
 

  export default userStore
  

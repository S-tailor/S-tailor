import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface userProfile {
    profileName: string;
    profilePk: number;
    image: string
  
}

interface CartItem {
  name: string;
  price: string;
  image?: string;
  link: string;
  closetPk: number;
  source: string;
}

interface User {
  user: userProfile[]
  cartList: CartItem[]
  cartCount: number
  // profilePk: number | 0
  setUser: (user: userProfile) => void
  clearUsers: () => void
  setCartCount: (count: number) => void
  setCartCounts: (list: CartItem[]) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (pk: number) => void

}

const userStore = create(
  persist<User>(
    (set) => ({
      user: [],
      cartList: [],
      cartCount: 0,
      // profilePk: 0,
      setUser: (by) => set(() => ({ user: [by] })),
      clearUsers: () => set({ user: [] }),
      setCartCount: (count) => set({ cartCount: count }),
      setCartCounts: (list) => set({ cartCount: list.length }),
      addToCart: (item) => set((state) => {
        const newCartList = [...state.cartList, item]
        return { cartList: newCartList, cartCount: newCartList.length }
      }),
      removeFromCart: (pk) => set((state) => {
        const newCartList = state.cartList.filter((item) => item.closetPk !== pk)
        return { cartList: newCartList, cartCount: newCartList.length }
      }),
    }),
    {
      name: 'userIdStorage'
    }
  )
)

export default userStore

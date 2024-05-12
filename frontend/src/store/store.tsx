import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface userProfile {
  profileName: string
  profilePk: number
  image: string
}

interface CartItem {
  name: string
  price: string
  image?: string
  link: string
  closetPk: number
  source: string
}

interface User {
  user: userProfile[]
  cartList: CartItem[]
  cartCount: number
  setUser: (user: userProfile) => void
  clearUsers: () => void
  setCartCount: (count: number) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (pk: number) => void
  updateCartList: (list: CartItem[]) => void
}

const userStore = create(
  persist<User>(
    (set) => ({
      user: [],
      cartList: [],
      cartCount: 0,
      setUser: (by) => set(() => ({ user: [by] })),
      clearUsers: () => set({ user: [] }),
      setCartCount: (count) => set({ cartCount: count }),
      addToCart: (item) =>
        set((state) => {
          const newCartList = [...state.cartList, item]
          const newCartCount = newCartList.length
          return { cartList: newCartList, cartCount: newCartCount }
        }),
      removeFromCart: (pk) =>
        set((state) => {
          const newCartList = state.cartList.filter((item) => item.closetPk !== pk)
          const newCartCount = newCartList.length
          return { cartList: newCartList, cartCount: newCartCount }
        }),
      updateCartList: (list: CartItem[]) =>
        set({
          cartList: list,
          cartCount: list.length
        })
    }),
    {
      name: 'userIdStorage'
    }
  )
)

export default userStore

import { api } from './api'

async function cartItemAdd(userInfo: number) {
  return await api.post('/cart/add', userInfo)
}

async function cartItemDelete(userInfo: any) {
    return await api.delete('/cart/add', userInfo)
}

async function cartItemList(Info:any) {
    return await api.get('/cart/add', Info)
}

export {cartItemAdd, cartItemDelete, cartItemList}
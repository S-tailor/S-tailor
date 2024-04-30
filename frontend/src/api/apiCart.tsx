import { api } from './api'

async function cartItemAdd(pk: number) {
  return await api.post(`/cart/add?closetPk=${pk}`)
}

async function cartItemDelete(pk: number) {
    return await api.delete(`/cart/delete?closetPk=${pk}`)
}

async function cartItemList(Info:any) {
    return await api.get(`/cart/list?profilePk=${Info}`)
}

export {cartItemAdd, cartItemDelete, cartItemList}
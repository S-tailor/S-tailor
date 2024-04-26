import { api } from './api'

async function userCreate(userInfo: string) {
  return await api.post('/user/create', userInfo)
}

async function userLogin(userInfo: string) {
  console.log(userInfo)
  return await api.post('/user/login', userInfo)
}

async function userCheck(userInfo: string) {
  return await api.get('user/check', { params: { id: userInfo } })
}

export { userCreate, userLogin, userCheck }

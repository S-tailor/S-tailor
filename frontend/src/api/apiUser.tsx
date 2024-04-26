import { api } from './api'

async function userCreate(userInfo) {
  return await api.post('/user/create', userInfo)
}

export { userCreate, userLogin, userAccountCheck }
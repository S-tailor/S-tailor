import { api } from './api'

async function userCreate(userInfo: string) {
  return await api.post('/user/create', userInfo)
}

async function userLogin(userInfo: string) {
  return await api.post('/user/login', userInfo)
  
}


export { userCreate, userLogin,}
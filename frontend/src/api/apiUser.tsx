import { api } from './api'

async function userCreate(id: string, password: string) {
  const requestBody = {
    id: id,
    password: password
  }
  return await api.post('/user/create', requestBody)
}

async function userLogin(id: string, password: string) {
  const requestBody = {
    id: id,
    password: password
  }
  return await api.post('/user/login', requestBody)
}

async function userCheck(id: string) {
  return await api.get('user/check', { params: { id: id } })
}

// async function userLogout() {
//   return await api.

// }

export { userCreate, userLogin, userCheck }

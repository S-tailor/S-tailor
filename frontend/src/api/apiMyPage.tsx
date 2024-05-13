import { api } from './api'

async function myPageTryonList(profilePk: number) {
  return await api.get(`/tryon/list?profilePk=${profilePk}`)
}

export { myPageTryonList }

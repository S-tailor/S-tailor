import { api } from './api'

async function tryOnGenerate(data: object) {
  return await api.post('/tryon/generate', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export { tryOnGenerate }

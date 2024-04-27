import { api } from './api'

async function profileCreate(userInfo: any) {
    return await api.post('/user/profile/create', userInfo, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
  }

async function profileSelect(userInfo: number) {
    return await api.post('/user/profile', userInfo)
}

async function profileList() {
    return await api.get('/user/profile/list')
}

async function profileEdit(userInfo:any) {
    return await api.put('/user/profile/edit', userInfo, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
  }
  export {profileCreate, profileSelect, profileList, profileEdit}
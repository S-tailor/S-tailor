import { api } from './api'

async function profileCreate(userInfo: any) {

     for (let [key, value] of userInfo.entries()) {
        console.log('요청',`${key}: ${value}`);
    } 
    
    return await api.post('/user/profile/create', userInfo, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
  }

async function profileSelect(id: number) {
    return await api.post(`/user/profile?profilePk=${id}`)
}

async function profileList(id : string) {
    return await api.get(`/user/profile/list?id=${id}`)
}

async function profileEdit(userInfo:any) {
    return await api.put('/user/profile/edit', userInfo, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
  }
  export {profileCreate, profileSelect, profileList, profileEdit}
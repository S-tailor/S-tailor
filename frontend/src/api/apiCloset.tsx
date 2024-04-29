import { api } from './api'

async function closetImgSearch(Info:FormData) {
    return await api.post('/closet/search', Info)
  }

async function closetTextSearch() {
    return await api.get('/closet/search')
}

async function closetItemSave(Info:string) {
    return await api.post('/closet/save', Info)
}

async function closetItemList(pk: number) {
    return await api.get(`/closet/list?profilePk=${pk}`)
}

async function closetItemDelete(Info:any) {
    return await api.delete('/closet/list', Info)
}

export {closetImgSearch, closetTextSearch, closetItemSave, closetItemList, closetItemDelete}


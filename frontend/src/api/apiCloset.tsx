import { api } from './api'

async function closetImgSearch(Info: FormData) {
  return await api.post('/search/image', Info)
}

async function closetTextSearch(content: string) {
  return await api.get(`/search/text?content=${content}`)
}

async function closetItemSave(Info: string) {
  return await api.post('/closet/save', Info)
}

async function closetItemList(pk: number) {
    return await api.get(`/closet/list?profilePk=${pk}`)
}

async function closetItemDelete(Info: any) {
  return await api.delete('/closet/list', Info)
}

export { closetImgSearch, closetTextSearch, closetItemSave, closetItemList, closetItemDelete }

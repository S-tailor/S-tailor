import { api } from './api'

interface SaveClothData {
  price: string
  thumbNail: string
  name: string
  link: string
  profilePk: string | null
  source: string
}

interface ClosetSearch {
  profilePk: string | null
  content: string
}

async function closetImgSearch(Info: FormData) {
  return await api.post('/search/image', Info)
}

async function closetTextSearch(content: string) {
  return await api.get(`/search/text?content=${content}`)
}

async function closetItemSave(data: SaveClothData): Promise<any> {
  return await api.post('/closet/save', data)
}

async function closetItemList(pk: number) {
  return await api.get(`/closet/list?profilePk=${pk}`)
}

async function closetSearch(data: ClosetSearch) {
  return await api.post('/closet/search', data)
}

async function closetItemDelete(pk: number): Promise<any> {
  return await api.delete(`/closet/delete?closetPk=${pk}`)
}

async function closetCategory(profilePk: number, category: string) {
  return await api.get(`/closet/filter?profilePk=${profilePk}&category=${category}`)
}

export {
  closetImgSearch,
  closetTextSearch,
  closetItemSave,
  closetItemList,
  closetSearch,
  closetItemDelete,
  closetCategory
}

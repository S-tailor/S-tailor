import { api } from './api'

interface SaveClothData {
  price: string
  image: string
  title: string
  link: string
  source: string
}

async function closetImgSearch(Info: FormData) {
  return await api.post('/search/image', Info)
}

async function closetTextSearch(content: string) {
  return await api.get(`/search/text?content=${content}`)
}

async function closetItemSave(data: SaveClothData): Promise<any> {
  const formData = new FormData()
  formData.append('price', data.price)
  formData.append('link', data.link)
  formData.append('thumbnail', data.image)
  formData.append('name', data.title)

  return await api.post('/closet/save', formData, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
}

async function closetItemList() {
  return await api.get('/closet/list')
}

async function closetItemDelete(Info: any) {
  return await api.delete('/closet/list', Info)
}

export { closetImgSearch, closetTextSearch, closetItemSave, closetItemList, closetItemDelete }

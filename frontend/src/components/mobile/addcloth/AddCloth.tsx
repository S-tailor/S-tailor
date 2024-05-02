import React, { useState } from 'react'
import { closetImgSearch, closetTextSearch, closetItemSave } from '@/api/apiCloset'
// import userStore from '@/store/store'
// import Pagination from 'react-js-pagination'

// 검색 결과 항목
interface SearchResultItem {
  price: string
  link: string
  image: string
  title: string
  source: string
}

// 선택한 옷들의 항목
interface SelectedClothItem extends SearchResultItem {}

const AddCloth: React.FC = () => {
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])

  const [selectedCloths, setSelectedCloths] = useState<SelectedClothItem[]>([])

  // const [count, setCount] = useState(1)

  // 옷 선택
  const handleSelectCloth = (cloth: SearchResultItem) => {
    setSelectedCloths((prev) => {
      const isAlreadySelected = prev.find((item) => item.link === cloth.link)
      if (isAlreadySelected) {
        return prev.filter((item) => item.link !== cloth.link)
      } else {
        return [...prev, cloth]
      }
    })
  }

  // const user = userStore((state) => state.user)
  const profilePk = (sessionStorage.getItem('profilePk'))

  // 옷 저장
  const handleSaveCloths = async () => {
    for (const cloth of selectedCloths) {
      // console.log(cloth)
      try {
       await closetItemSave({
          price: cloth.price,
          thumbNail: cloth.image,
          name: cloth.title,
          link: cloth.link,
          profilePk: profilePk,
          source: ''
        })

      } catch (error) {
        console.error('저장 실패', error)
      }
    }
    // 저장 후 선택한 옷 초기화
    setSelectedCloths([])
  }

  // 가격이 있는 정보만 가져온다.
  async function updateResults(data: SearchResultItem[]) {
    const filteredResults = data.filter((item) => item.price !== null) as SearchResultItem[]
    setResults(filteredResults)
  }

  // 검색어 저장
  function saveText(event: any) {
    setText(event.target.value)
  }

  // 텍스트 검색
  async function textSearch() {
    const response = await closetTextSearch(text)
   
    updateResults(response.data.result)
  }

  // 업로드 이미지 저장
  function saveImage(event: any) {
    setImage(event.target.files[0])
  }

  // 이미지 업로드 검색
  async function imageSearch() {
    const formdata = new FormData()
    if (image) {
      formdata.append('image', image)
    }
    const response = await closetImgSearch(formdata)
    
    // setCount(response.data.result.length)
    updateResults(response.data.result)
  }

  // 결과 렌더링
  function RenderResult() {
    return (
      <div>
        {results.map((item: SearchResultItem, index: number) => (
          <div key={index}>
            <img
              src={item.image}
              alt={item.title}
              onClick={() => handleSelectCloth(item)}
              style={{ width: '100px', height: '100px' }}
            />
            <p>{item.title}</p>
            <p>{item.price}</p>
            <p>{item.source}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h1>AddCloth Component</h1>
      <input type="text" onChange={(e) => saveText(e)} placeholder="검색어를 입력하세요." />
      <button onClick={() => textSearch()}>Text Search</button>
      <input type="file" onChange={(e) => saveImage(e)}></input>
      <button onClick={() => imageSearch()}>Image Search</button>
      <div>
        <h2>선택한 옷</h2>
        {selectedCloths.map((cloth, index) => (
          <div key={index}>
            <img src={cloth.image} alt={cloth.title} />
            <h4>{cloth.title}</h4>
            <p>{cloth.price}</p>
            <button onClick={() => handleSelectCloth(cloth)}>취소</button>
          </div>
        ))}
        <button onClick={handleSaveCloths}>추가</button>
      </div>
      <RenderResult />
      {/* <Pagination totalItemsCount={count} onChange={(e) => console.log(e)}></Pagination> */}
    </div>
  )
}

export default AddCloth

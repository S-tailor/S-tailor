import React, { useState } from 'react'
import { closetImgSearch, closetTextSearch } from '@/api/apiCloset'
// import Pagination from 'react-js-pagination'

interface SearchResultItem {
  price: string
  link: string
  image: string
  title: string
  source: string
}

const AddCloth: React.FC = () => {
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])
  // const [count, setCount] = useState(1)

  // 가격이 있는 정보만 가져온다.
  async function updateResults(data: any[]) {
    const filteredResults = data.filter((item) => item.price !== null) as SearchResultItem[]
    setResults(filteredResults)
  }

  // 검색어 저장
  function saveText(event: any) {
    setText(event.target.value)
  }

  // 텍스트 검색
  async function textSearch() {
    let response = await closetTextSearch(text)
    // setCount(response.data.result.length)
    console.log(response.data.result)
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
    console.log(response)
    // setCount(response.data.result.length)
    updateResults(response.data.result)
  }

  // 결과 렌더링
  function RenderResult() {
    return (
      <div>
        {results.map((item: SearchResultItem, index: number) => (
          <div key={index}>
            <img src={item.image} alt={item.title} style={{ width: '100px', height: '100px' }} />
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
      <RenderResult />
      {/* <Pagination totalItemsCount={count} onChange={(e) => console.log(e)}></Pagination> */}
    </div>
  )
}

export default AddCloth

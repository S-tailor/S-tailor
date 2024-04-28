import React, { useState } from 'react'
import { closetImgSearch, closetTextSearch } from '@/api/apiCloset'
import Pagination from 'react-js-pagination'

const AddCloth: React.FC = () => {
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [count, setCount] = useState(1)

  async function textSearch() {
    let response = await closetTextSearch(text)
    setCount(response.data.result.length)
    console.log(response.data.result)
  }

  function saveImage(event) {
    setImage(event.target.files[0])
  }

  async function imageSearch() {
    const formdata = new FormData()
    formdata.append('image', image)
    const response = await closetImgSearch(formdata)
    console.log(response)
    setCount(response.data.result.length)
  }

  function saveText(event) {
    setText(event.target.value)
  }

  return (
    <div>
      <h1>AddCloth Component</h1>
      <input type="text" onChange={(e) => saveText(e)} placeholder="검색어를 입력 하세요..." />
      <button onClick={() => textSearch()}>Text Search</button>
      <input type="file" onChange={(e) => saveImage(e)}></input>
      <button onClick={() => imageSearch()}>Image Search</button>
      <Pagination totalItemsCount={count} onChange={(e) => console.log(e)}></Pagination>
    </div>
  )
}

export default AddCloth

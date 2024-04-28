import React, { useState } from 'react'
import { closetImgSearch, closetTextSearch } from '@/api/apiCloset'

const ClosetSearch: React.FC = () => {
  const [image, setImage] = useState(null)

  async function textSearch(content: string) {
    console.log(content)
    let response = await closetTextSearch(content)
    console.log(response.data.result)
  }

  function saveImage(event) {
    console.log(event)
    setImage(event.target.files[0])
  }

  async function imageSearch() {
    console.log('123123')
    const formdata = new FormData()
    formdata.append('image', image)
    const response = await closetImgSearch(formdata)
    console.log(response)
  }

  return (
    <div>
      <h1>ClosetSearch Component</h1>
      <button onClick={() => textSearch('mantoman')}>Text Search</button>
      <input type="file" onChange={(e) => saveImage(e)}></input>
      <button onClick={() => imageSearch()}>Image Search</button>
    </div>
  )
}

export default ClosetSearch

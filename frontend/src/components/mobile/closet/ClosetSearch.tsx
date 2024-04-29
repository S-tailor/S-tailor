import React from 'react'
// import { closetImgSearch, closetTextSearch } from '@/api/apiCloset'

// 현재 코드는 구글 검색 코드입니다.
// 이 화면에서는 각 프로필의 옷장 DB에 있는 옷을 검색할 수 있게 해야합니다.

const ClosetSearch: React.FC = () => {
  //   const [image, setImage] = useState(null)
  //   const [text, setText] = useState('')

  //   async function textSearch() {
  //     let response = await closetTextSearch(text)
  //     console.log(response.data.result)
  //   }

  //   function saveImage(event) {
  //     setImage(event.target.files[0])
  //   }

  //   async function imageSearch() {
  //     const formdata = new FormData()
  //     formdata.append('image', image)
  //     const response = await closetImgSearch(formdata)
  //     console.log(response)
  //   }

  //   function saveText(event) {
  //     setText(event.target.value)
  //   }

  return (
    <div>
      <h1>ClosetSearch Component</h1>
      {/* <input type="text" onChange={(e) => saveText(e)} placeholder="검색어를 입력하세요." />
      <button onClick={() => textSearch()}>Text Search</button>
      <input type="file" onChange={(e) => saveImage(e)}></input>
      <button onClick={() => imageSearch()}>Image Search</button> */}
    </div>
  )
}

export default ClosetSearch

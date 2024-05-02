import React, { useState, useRef } from 'react'
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

// 카메라
type CameraMode = 'user' | 'environment'

const AddCloth: React.FC = () => {
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])

  const [selectedCloths, setSelectedCloths] = useState<SelectedClothItem[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const [camera, setCamera] = useState<CameraMode>('environment')

  const CameraClick = () => {
    const constraints = { video: { facingMode: camera } }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
        }
      })
      .catch((error) => {
        console.error('카메라 접근 오류:', error)
      })
  }

  const handleCapture = () => {
    const canvas = document.createElement('canvas')
    const video = videoRef.current
    if (video && video.videoWidth > 0) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            console.log(url) // 로그로 URL을 찍어 확인
            const img = document.createElement('img')
            img.onload = () => {
              URL.revokeObjectURL(url)
            }
            img.src = url
            document.body.appendChild(img)
          }
        })
      }
    }
  }

  const toggleCamera = () => {
    setCamera((prevCamera) => (prevCamera === 'environment' ? 'user' : 'environment'))
    const video = videoRef.current
    if (video && video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    CameraClick()
  }

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
  const profilePk = sessionStorage.getItem('profilePk')

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
      <div>
        <button onClick={CameraClick}>카메라 켜기</button>
        <button onClick={handleCapture}>사진 촬영</button>
        <button onClick={toggleCamera}>카메라 전환</button>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }}></video>
      </div>
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

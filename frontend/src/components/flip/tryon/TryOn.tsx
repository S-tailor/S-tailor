import React, { useRef, useState, useEffect, useMemo } from 'react'
import { CSSProperties } from 'react'
import { closetItemList } from '@/api/apiCloset'
import userStore from '@/store/store'
import { tryOnGenerate } from '@/api/apiTryOn'

const TryOn: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [itemList, setItemList] = useState<clothInfo[]>([])
  const { user } = userStore()
  const [currentIndex, setCurrentIndex] = useState(0)

  const [fileImage, setFileImage] = useState<File>()
  const [fileUrl, setFileUrl] = useState<string>('')
  const [resultUrl, setResultUrl] = useState<string>('')

  // const Pk = user[0]?.profilePk
  const Pk = sessionStorage.getItem('profilePk')
  interface clothInfo {
    name: string
    image: string
  }

  useEffect(() => {
    if (Pk) {
      getClosetItem()
    }
  }, [])

  const getClosetItem = async () => {
    await closetItemList(Number(Pk))
      .then((res) => {
        setItemList(res.data.result)
      })
      .catch((err) => console.log('다시 시도해주세요', err))
  }

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = isCameraOn ? stream : null
        }
      } catch (error) {
        console.error(error)
      }
    }
    initCamera()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [isCameraOn])

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState)
  }

  const videoStyle: CSSProperties = useMemo(
    () => ({
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      transform: 'scaleX(-1)'
    }),
    []
  )

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 2) % itemList.length) // 다음 아이템
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 2 + itemList.length) % itemList.length) // 이전 아이템
  }

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh'
  }

  const buttonStyle: CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 10,
    width: '500px',
    height: '250px',
    fontSize: '100px'
  }

  const itemListStyle: CSSProperties = {
    zIndex: 99999,
    position: 'absolute',
    top: '50%', // 화면 세로 중앙에 위치
    left: '50%', // 화면 가로 중앙에 위치
    transform: 'translate(-50%, -50%)', // 중앙 정확히 맞추기
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const arrowStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '2rem',
    color: 'white',
    background: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer'
  }

  const renderItem = (index: number) => {
    const item = itemList[index % itemList.length] // Use modulo for wrapping
    return (
      <div>
        <img src={item.image} alt="옷 사진" style={{ width: '300px', height: '300px' }} />
        <p>{item.name}</p>
      </div>
    )
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileImage(file)
    if (file) {
      setFileUrl(URL.createObjectURL(file))
    }
  }

  const handleTryOnButton = async () => {
    const formData = new FormData()
    if (fileImage instanceof File) {
      formData.append('model', fileImage)
    }
    formData.append(
      'cloth',
      'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQrZOJkf9outGmhW7vnfRic8qHvuJ-ZbpQ9ucUQJAeITpd5inhVtjN7_e-acDIFNS-tWUG2IcKEctJ27M2xELGtB2RuUwSrPw6wWEngHikdk_k8SmVDje45_g&usqp=CAE'
    )
    formData.append('profilePk', '12')
    formData.append('category', 'lower_body')

    const response = await tryOnGenerate(formData)
    setResultUrl(response.data.generatedImageURL)
  }
  return (
    <>
      <button onClick={toggleCamera}>{isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}</button>
      <button onClick={handleTryOnButton}>Try On</button>
      <div>{fileUrl && <img alt="originModel" src={fileUrl} />}</div>
      <label htmlFor="imgFile">
        <input type="file" name="imgFile" id="imgFile" onChange={handleFileChange} />
      </label>

      <div>{resultUrl && <img alt="result" src={resultUrl} />}</div>
      <video autoPlay ref={videoRef} style={videoStyle}></video>
      <div style={containerStyle}>
        {isCameraOn && itemList.length > 0 && (
          <section>
            {
              <div style={itemListStyle}>
                <button onClick={handlePrev} style={{ ...arrowStyle, left: '20px' }}>
                  {'<'}
                </button>

                <div
                  style={{
                    zIndex: 99999,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <button
                    onClick={handlePrev}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '20px',
                      transform: 'translateY(-50%)',
                      fontSize: '2rem',
                      color: 'white',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer'
                    }}
                  >
                    {'<'}
                  </button>
                  {renderItem(currentIndex)}
                  {renderItem(currentIndex + 1)}
                  {renderItem(currentIndex + 2)}
                  <button
                    onClick={handleNext}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '20px',
                      transform: 'translateY(-50%)',
                      fontSize: '2rem',
                      color: 'white',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer'
                    }}
                  >
                    {'>'}
                  </button>
                </div>

                <button onClick={handleNext} style={{ ...arrowStyle, right: '20px' }}>
                  {'>'}
                </button>
              </div>
            }
          </section>
        )}
        <video autoPlay ref={videoRef} style={videoStyle}></video>
      </div>
    </>
  )
}

export default TryOn

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { CSSProperties } from 'react'
import { closetItemList } from '@/api/apiCloset'
import { tryOnGenerate } from '@/api/apiTryOn'
import Motion from '@/components/flip/tryon/motion/Motion'
// import styles from '@/scss/addcloth.module.scss'

const TryOn: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [itemList, setItemList] = useState<clothInfo[]>([])

  const [currentIndex, setCurrentIndex] = useState(0)

  const [fileUrl, setFileUrl] = useState<string>('')

  // const { user } = userStore()

  const [resultUrl, setResultUrl] = useState<string>('')
  // const [showResults, setShowResults] = useState(false)
  // const [imagePath, setImagePath] = useState('')
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  // const [cameraActive, setCameraActive] = useState(false)
  // const [captureMode, setCaptureMode] = useState(false)
  // const [searchMode, setSearchMode] = useState<'text' | 'upload' | 'camera' | null>(null)

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
    Motion(handleCapture)
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
      // objectFit: 'cover',
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

  // const buttonStyle: CSSProperties = {
  //   position: 'absolute',
  //   top: '20px',
  //   left: '20px',
  //   zIndex: 10,
  //   width: '500px',
  //   height: '250px',
  //   fontSize: '100px'
  // }

  const itemListStyle: CSSProperties = {
    zIndex: 99999,
    position: 'absolute',
    top: '70%', // 화면 세로 중앙에 위치
    left: '30%', // 화면 가로 중앙에 위치
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

  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   setFileImage(file)
  //   if (file) {
  //     setFileUrl(URL.createObjectURL(file))
  //   }
  // }

  // const handleTryOnButton = async () => {
  //   const formData = new FormData()
  //   if (fileImage instanceof File) {
  //     formData.append('model', fileImage)
  //   }
  //   formData.append('profilePk', '1')
  //   formData.append('category', 'dresses')
  //   formData.append('closetPk', '86')

  //   const response = await tryOnGenerate(formData)
  //   setResultUrl(response.data.result.generatedImage)
  // }

  const handleTryOn = async (file) => {
    const formData = new FormData()
    if (file instanceof File) {
      formData.append('model', file)
    }
    formData.append('profilePk', '1')
    formData.append('category', 'dresses')
    formData.append('closetPk', '86')

    const response = await tryOnGenerate(formData)
    setResultUrl(response.data.result.generatedImage)
  }

  const handleCapture = async () => {
    const canvas = document.createElement('canvas')
    const video = videoRef.current

    if (video && video.videoWidth > 0) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png')
        })
        if (blob) {
          const url = URL.createObjectURL(blob).split('/')
          const file = new File([blob], `${url[url.length - 1]}.png`, { type: 'image/png' })
          console.log('Capture successful:', url)
          saveImage(file)
        }
      }
    }
  }

  // 업로드 이미지 저장
  function saveImage(input: File) {
    let file: File
    // const file = input.target.files?.[0]
    // setFileImage(file)
    // if (file) {
    //   setFileUrl(URL.createObjectURL(file))
    // }
    handleTryOn(input)
    if (input instanceof File) {
      // 직접 File 객체가 입력된 경우
      file = input
    } else if (input.target.files && input.target.files[0]) {
      // 이벤트를 통해 파일이 입력된 경우
      file = input.target.files[0]
    }

    // 파일이 존재하는 경우 처리
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFileUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 업로드 이미지 띄우기
  // function RenderUploadedImage() {
  //   return (
  //     <div>
  //       <img width="2160" height="3840" src={imagePath} style={videoStyle}></img>
  //     </div>
  //   )
  // }
  return (
    <>
      {/* <div className={styles.picture}>
        imagePath&&
        <RenderUploadedImage />
      </div> */}
      {/* <img
        className={styles.camera}
        src="/assets/camerashot.png"
        alt="camera"
        onClick={handleCapture}
      /> */}
      <button onClick={toggleCamera}>{isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}</button>
      {/* <button onClick={handleTryOnButton}>Try On</button> */}
      <div>captured image {fileUrl && <img alt="originModel" src={fileUrl} />}</div>
      {/* <label htmlFor="imgFile">
        <input type="file" name="imgFile" id="imgFile" onChange={handleFileChange} />
      </label> */}

      <div>result image {resultUrl && <img alt="result" src={resultUrl} />}</div>
      <div id="videoContainer">
        <video
          id="webcam"
          width="2160"
          height="3840"
          ref={videoRef}
          style={videoStyle}
          autoPlay
        ></video>
        <canvas id="canvas-source" width="2160" height="3840" style={{ display: 'none' }}></canvas>
        <canvas id="canvas-blended" width="2160" height="3840" style={{ display: 'none' }}></canvas>
      </div>
      {/* <video autoPlay ref={videoRef} style={videoStyle}></video> */}
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
        {/* <video autoPlay ref={videoRef} style={videoStyle}></video> */}
      </div>
    </>
  )
}

export default TryOn

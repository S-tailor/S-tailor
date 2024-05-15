// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { CSSProperties } from 'react'
import { closetItemList } from '@/api/apiCloset'
import { tryOnGenerate } from '@/api/apiTryOn'
import Motion from '@/components/flip/tryon/motion/Motion'
import styles from '../../../scss/'
// import styles from '@/scss/addcloth.module.scss'

const TryOn: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [itemList, setItemList] = useState<clothInfo[]>([])
  const [listLength, setListLength] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [handleConfirm, setHandleConfirm] = useState(false)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [modal, setModal] = useState(false)
  const lengthRef = useRef()
  const [flag, setFlag] = useState(0)
  const [nextPhase, setNextPhase] = useState(0)
  const [resultUrl, setResultUrl] = useState<string>('')
  const phaseRef = useRef(0)
  const itemListRef = useRef([])
  const currentIndexRef = useRef(0)
  const Pk = sessionStorage.getItem('profilePk')
  interface clothInfo {
    name: string
    image: string
  }

  const categoryList = {
    Outerwear: 'upper_body',
    Jacket: 'upper_body',
    Coat: 'upper_body',
    Top: 'upper_body',
    Shirt: 'upper_body',
    Pants: 'lower_body',
    Shorts: 'lower_body',
    Jeans: 'lower_body',
    Skirt: 'lower_body',
    Miniskrit: 'lower_body',
    Dress: 'dresses'
  }

  useEffect(() => {
    if (Pk) {
      getClosetItem()
    }
    Motion(handleCapture, handlePrev, handleNext, flag, handleYes, handleNo)
  }, [])

  const handleYes = () => {
    console.log('yes')
    phaseRef.current = 1
  }

  const handleNo = () => {
    console.log('no')
    setNextPhase(2)
    phaseRef.current = 2
  }

  const getClosetItem = async () => {
    await closetItemList(Number(Pk))
      .then((res) => {
        setItemList(res.data.result)
        itemListRef.current = res.data.result
        lengthRef.current = res.data.result.length
        console.log('length', lengthRef.current)
        console.log(`setItemList ${res.data.result[0]['image']}`)
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
      position: 'relative',
      transform: 'scaleX(-1)'
    }),
    []
  )

  const handleNext = () => {
    currentIndexRef.current = (currentIndexRef.current + 1) % lengthRef.current
    setCurrentIndex((prev) => (prev + 1) % lengthRef.current)
  }

  const handlePrev = () => {
    // console.log('handlePrev', item)
    // currentIndexRef.current = (currentIndexRef.current - 1) % lengthRef.current
    // setCurrentIndex((prev) => (prev - 1 + lengthRef.current) % lengthRef.current)
    if (lengthRef.current > 0) {
      const newIndex = (currentIndexRef.current - 1 + lengthRef.current) % lengthRef.current
      currentIndexRef.current = newIndex
      setCurrentIndex(newIndex)
    }
  }

  const containerStyle: CSSProperties = {
    width: '100vw',
    height: '100vh'
  }

  const itemListStyle: CSSProperties = {
    zIndex: 99999,
    position: 'absolute',
    top: '70%',
    left: '30%',
    transform: 'translate(-50%, -50%)',
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
    padding: '10px 20px'
  }

  const renderItem = (index: number) => {
    const item = itemListRef.current[index % lengthRef.current]
    return (
      <div>
        <img src={item.image} alt="옷 사진" style={{ width: '300px', height: '300px' }} />
        <p>{item.name}</p>
      </div>
    )
  }

  const handleTryOn = async (file) => {
    const formData = new FormData()
    if (file instanceof File) {
      formData.append('model', file)
    }
    formData.append('profilePk', Pk)
    formData.append('category', categoryList[itemListRef.current[currentIndexRef.current].category])
    formData.append('closetPk', itemListRef.current[currentIndexRef.current].closetPk)

    const response = await tryOnGenerate(formData)
    setResultUrl(response.data.result.generatedImage)
  }

  const handleCapture = async () => {
    setFlag(1)
    setModal(true)
    if (phaseRef.current == 2) {
      setModal(false)
      phaseRef.current = 0
      location.reload()
      return
    }
    if (phaseRef.current == 0) {
      setModal(false)
      location.reload()
      return
    } else if (phaseRef.current == 1) {
      setModal(false)
      phaseRef.current = 0

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
  }

  // 업로드 이미지 저장
  function saveImage(input: File) {
    let file: File
    handleTryOn(input)
    if (input instanceof File) {
      // 직접 File 객체가 입력된 경우
      file = input
    } else if (input.target.files && input.target.files[0]) {
      // 이벤트를 통해 파일이 입력된 경우
      file = input.target.files[0]
    }
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFileUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <button onClick={toggleCamera}>{isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}</button>
      <div>captured image {fileUrl && <img alt="originModel" src={fileUrl} />}</div>

      <div>result image {resultUrl && <img alt="result" src={resultUrl} />}</div>
      <div id="videoContainer" style={{ position: 'relative' }}>
        <div style={containerStyle}>
          {isCameraOn && (
            <section>
              {
                <div style={itemListStyle}>
                  {flag == 1 ? (
                    <img
                      src="/assets/noR.png"
                      alt="no"
                      onClick={handleNo}
                      style={{ ...arrowStyle, left: '680px' }}
                    />
                  ) : (
                    <img
                      src="/assets/rightW.png"
                      alt="right"
                      onClick={handlePrev}
                      style={{ ...arrowStyle, left: '680px' }}
                    />
                  )}

                  <div
                    style={{
                      zIndex: 99999,
                      position: 'absolute',
                      top: '50%',
                      left: '300px',
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <a style={{ position: 'absolute', top: '40%' }}>
                      {/* <h1>{modal && <img src="/assets/modal.png" alt="" />}</h1> */}
                    </a>
                    <a style={{ border: '30px solid green' }}>
                      {renderItem(currentIndexRef.current)}
                    </a>
                    {renderItem(currentIndexRef.current + 1)}
                    {renderItem(currentIndexRef.current + 2)}
                  </div>

                  {flag == 1 ? (
                    <img
                      src="/assets/yesG"
                      alt="yes"
                      onClick={handleYes}
                      style={{ ...arrowStyle, right: '-100px' }}
                    />
                  ) : (
                    <img
                      src="/assets/leftW.png"
                      onClick={handleNext}
                      style={{ ...arrowStyle, right: '-100px' }}
                      alt="left"
                    />
                  )}
                </div>
              }
            </section>
          )}
        </div>
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
    </>
  )
}

export default TryOn

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { CSSProperties } from 'react'
import { closetItemList } from '@/api/apiCloset'
import { tryOnGenerate } from '@/api/apiTryOn'
import Motion from '@/components/flip/tryon/motion/Motion'
import styles from '../../../scss/tryon.module.scss'
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
  //const [flag, setFlag] = useState(0)
  const [nextPhase, setNextPhase] = useState(0)
  const [resultUrl, setResultUrl] = useState<string>('')
  const phaseRef = useRef(0)
  const itemListRef = useRef([])
  const currentIndexRef = useRef(0)
  const Pk = sessionStorage.getItem('profilePk')
  const captureFlag = useRef(false)
  const initFlag = useRef(false)
  const count = 3
  const isCaptured = useRef(false)
  const flag = useRef(0)
  const yesFlag = useRef(false)

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
    Motion(getIsCaptured , beforeCapture, handleCapture, handlePrev, handleNext, flag, handleYes, handleNo)
  }, [])

  const handleYes = () => {
    if(captureFlag.current || yesFlag.current) {
      return
    }
    console.log('yes')
    console.log(phaseRef.current)
    phaseRef.current = 1
    yesFlag.current = true
    setTimeout(()=>{handleCapture(1)},3000)
  }

  const handleNo = () => {
    if(captureFlag.current || yesFlag.current) {
      return
    }
    setNextPhase(2)
    console.log('no')
    phaseRef.current = 2
    flag.current = 0
    handleCapture(2)
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
      // width: '100vw',
      // height: '100vh',
      // objectFit: 'cover',
      // position: 'relative',
      // transform: 'scaleX(-1)'
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

  const itemListStyle: CSSProperties = {
    // zIndex: 99999,
    // position: 'absolute',
    // top: '70%',
    // left: '30%',
    // transform: 'translate(-50%, -50%)',
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center'
  }

  const arrowStyle: CSSProperties = {
    // position: 'absolute',
    // top: '50%',
    // transform: 'translateY(-50%)',
    // fontSize: '2rem',
    // color: 'white',
    // background: 'rgba(0, 0, 0, 0.5)',
    // border: 'none',
    // padding: '10px 20px'
  }

  const renderItem = (index: number) => {
    const item = itemListRef.current[index % lengthRef.current]
    return (
      <div>
        <img src={item.image} alt="옷 사진" className={styles.img} />
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

  const beforeCapture = async () => {
    console.log("123")
    flag.current = 1
    isCaptured.current = true
    setModal(true)
  }

  useEffect(()=>{
    console.log("flag ",flag.current)
  },[flag.current])

  const getIsCaptured = () => {
    return isCaptured.current
  }

  const handleCapture = async (phase: number) => {
    console.log('capture')
    console.log(phaseRef.current)
    if(!captureFlag.current) {
      captureFlag.current = true;
      if (phase == 2) {
        flag.current = 0
        setModal(false)
        phaseRef.current = 0
        captureFlag.current = false
        isCaptured.current = false
        setModal(false)
        yesFlag.current = false
        return
      }
      if (phase == 0) {
        setModal(false)
        location.reload()
        return
      } else if (phase == 1) {
        console.log("capture")
        setModal(false)
  
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
    } else {
      return
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
    <div className={styles.mainContainer}>
      
      <div className={styles.bgVideo}>
        <video
          className={styles.bgVideoContent}
          id="webcam"
          width="2160"
          height="3840"
          ref={videoRef}
          autoPlay
        ></video>
      </div>
      
      <button 
        className={styles.turnOnBtn}
        onClick={toggleCamera}>
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>

      <div className={styles.capturedImg}>captured image {fileUrl && <img alt="originModel" src={fileUrl} />}</div>
      <div className={styles.resultImg}>result image {resultUrl && <img alt="result" src={resultUrl} />}</div>
      <div>{count}</div>
          <div className={styles.carouselContainer}>
          {isCameraOn && (
            <div className={styles.carousel}>
              {
                <div className={styles.carouselInner}>

                  <div className={styles.carouselLeft}>
                    {flag.current == 1 ? (
                      <img
                        src="/assets/yesG.png"
                        alt="yes"
                        onClick={handleYes}
                        className={styles.yesBtn}
                      />
                    ) : (
                      <img
                        src="/assets/leftW.png"
                        onClick={handleNext}
                        className={styles.leftArrow}
                        alt="left"
                      />
                    )}
                  </div>

                  <div className={styles.carouselMiddle}>
 
                      <a style={{ position: 'absolute', top: '40%' }}>
                      </a>
                      <a style={{ border: '30px solid green' }}>
                        {renderItem(currentIndexRef.current)}
                      </a>
             
                      {renderItem(currentIndexRef.current + 1)}
               
                      {renderItem(currentIndexRef.current + 2)}
            
                  </div>

                  <div className={styles.carouselRight}>
                    {flag.current == 1 ? (
                      <img
                        src="/assets/noR.png"
                        alt="no"
                        onClick={handleNo}
                        className={styles.noBtn}
                      />
                    ) : (
                      <img
                        src="/assets/rightW.png"
                        alt="right"
                        onClick={handlePrev}
                        className={styles.rightArrow}
                      />
                    )}
                  </div>

                </div>
                }
            </div>
          )}

        <canvas id="canvas-source" width="2160" height="3840" style={{ display: 'none' }}></canvas>
        <canvas id="canvas-blended" width="2160" height="3840" style={{ display: 'none' }}></canvas>
      </div>
    </div>
  )
}

export default TryOn

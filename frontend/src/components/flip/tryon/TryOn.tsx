// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react'
import { CSSProperties } from 'react'
import { closetItemList } from '@/api/apiCloset'
import { tryOnGenerate } from '@/api/apiTryOn'
import Motion from '@/components/flip/tryon/motion/Motion'
import styles from '../../../scss/tryon.module.scss'

const TryOn: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isBeforeCapture, setIsBeforeCapture] = useState(false)
  const [arrowActive, setArrowActive] = useState({ left: false, right: false })

  const [itemList, setItemList] = useState<clothInfo[]>([])
  const [listLength, setListLength] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [handleConfirm, setHandleConfirm] = useState(false)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [modal, setModal] = useState(false)
  const lengthRef = useRef()
  const [nextPhase, setNextPhase] = useState(0)
  const [resultUrl, setResultUrl] = useState<string>('')
  const phaseRef = useRef(0)
  const itemListRef = useRef([])
  const currentIndexRef = useRef(0)
  const Pk = sessionStorage.getItem('profilePk')
  const captureFlag = useRef(false)
  const initFlag = useRef(false)

  const isCaptured = useRef(false)
  const flag = useRef(0)
  const yesFlag = useRef(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showResultImg, setShowResultImg] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(5)
  const messageRef = useRef('')
  const count = useRef()
  count.current = timeLeft
    const timer = () => setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
      if (count.current < 2) {
        return () => clearInterval(timer), yesFlag.current = false
      }
    }, 1000)

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
  
  const [startTimeLeft, setStartTimeLeft] = useState<number>(6)
  const [timerAtStart, setTimerAtStart] = useState<boolean>(false)
  const startCount = useRef()
  startCount.current = startTimeLeft
  const startTimer = () => setInterval(() => {
    setStartTimeLeft((prevTime) => prevTime - 1)
    if (startCount.current < 1) {
      return () => clearInterval(startTimer)
    }
    }, 1000)

  useEffect(() => {
    setTimerAtStart(true)
    startTimer()
    setTimeout(() => {
      setTimerAtStart(false)
    },6000)
    if (Pk) {
      getClosetItem()
    }
    Motion(getIsCaptured , beforeCapture, handleCapture, handlePrev, handleNext, flag, handleYes, handleNo)
  }, [])

  const handleYes = () => {
    if(captureFlag.current || yesFlag.current) {
      return
    }
    phaseRef.current = 1
    yesFlag.current = true
    setArrowActive({ ...arrowActive, left: true })
    timer()
    messageRef.current='5초 후 사용자의 모습을 촬영합니다.'
    setTimeout(()=>{handleCapture(1)},5000)
  }
  
  const handleNo = () => {
    if(captureFlag.current || yesFlag.current) {
      return
    }
    setNextPhase(2)
    setIsBeforeCapture(false)
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


  const handleNext = () => {
    currentIndexRef.current = (currentIndexRef.current + 1) % lengthRef.current
    setCurrentIndex((prev) => (prev + 1) % lengthRef.current)
    setArrowActive({ ...arrowActive, right: true })
    
  }

  const handlePrev = () => {
    if (lengthRef.current > 0) {
      const newIndex = (currentIndexRef.current - 1 + lengthRef.current) % lengthRef.current
      currentIndexRef.current = newIndex
      setCurrentIndex(newIndex)
      setArrowActive({ ...arrowActive, left: true })
    }
  }

  const renderItem = (index: number) => {
    if (!lengthRef.current || lengthRef.current == 0) {
      return <p className={styles.emptyText}>옷장이 비었습니다.</p>
    }
    const item = itemListRef.current[index % lengthRef.current]
    return (
      <div className={styles.carouselContent}>
        <img src={item.image} alt="옷 사진" className={styles.carouselImg} />
        <p className={styles.carouselName}>{item.name}</p>
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
    messageRef.current = '이 옷을 입어보시겠습니까?'
    setIsBeforeCapture(true)
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
        setArrowActive({ ...arrowActive, right: true })
        flag.current = 0
        setModal(false)
        phaseRef.current = 0
        messageRef.current=''
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

  useEffect(() => {
    if (fileUrl) {
      setTimeout(() => {
        setShowVideo(true)
      }, 2000)
    }
  }, [fileUrl])

  const handleVideoEnd = () => {
    setShowVideo(false)
    setShowResultImg(true)
  }

  useEffect(() => {
    if (arrowActive.left || arrowActive.right) {
      const timeout = setTimeout(() => {
        setArrowActive({ left: false, right: false })
      }, 300);
      return () => clearTimeout(timeout)
    }
  }, [arrowActive])

  return (
    <div className={styles.mainContainer}>
    {showVideo ? (
      <video 
        src="/assets/ssfAd.mp4" 
        autoPlay 
        onEnded={handleVideoEnd}
        style={{ width: '100vw', height: '100vh' }}
      />
      ) : showResultImg ? (
        <img 
          src="/assets/ad11.png"
          alt="Result" 
          style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
        />
    ) : (
    fileUrl ? (
      <img className={styles.capturedImg} alt="Captured model" src={fileUrl} />
    ) : (
      <>
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
      {!timerAtStart &&
      <button 
        className={styles.turnOnBtn} 
        style={{ backgroundColor: isBeforeCapture ? '#222222' : 'transparent', color: isBeforeCapture ? 'white' : '#222222' }}
        >
        Try on
      </button>}

      
      {/* <div>{resultUrl && <img className={styles.resultImg} alt="result" src={resultUrl} />}</div> */}
      {/* <div>{resultUrl && <img className={styles.resultImg} alt="result" src="/assets/ad11.png" />}</div> */}
      {yesFlag.current && 
      <div className={styles.timer}>
        {count.current}
      </div>}

      {timerAtStart &&
      <div className={styles.timer}>
        {startCount.current}
      </div>}  
      
      {<div className={styles.tryonMessage}>
        {messageRef.current}
      </div>}
          
          {!timerAtStart &&
            <div className={styles.carousel}>
              {
                <div className={styles.carouselInner}>

                  <div className={styles.carouselLeft}>
                    {flag.current == 1 ? (
                      <img
                        src="/assets/yesG.png"
                        alt="yes"
                        onClick={handleYes}
                        className={`${styles.yesBtn} ${arrowActive.left ? styles.active : ''}`}
                      />
                    ) : (
                      <img
                        src="/assets/leftW.png"
                        onClick={handlePrev}
                        className={`${styles.leftArrow} ${arrowActive.left ? styles.active : ''}`}
                        alt="left"
                      />
                    )}
                  </div>

                  <div className={styles.carouselMiddle}>
                      
                      <div className={styles.firstImg}>
                        {renderItem((currentIndexRef.current - 1 + lengthRef.current) % lengthRef.current)}
                      </div>
                      <div className={styles.secondImg}>
                        {renderItem(currentIndexRef.current)}
                      </div>
                      <div className={styles.thirdImg}>
                        {renderItem((currentIndexRef.current + 1) % lengthRef.current)} 
                      </div>
            
                  </div>

                  <div className={styles.carouselRight}>
                    {flag.current == 1 ? (
                      <img
                        src="/assets/noR.png"
                        alt="no"
                        onClick={handleNo}
                        className={`${styles.noBtn} ${arrowActive.right ? styles.active : ''}`}
                      />
                    ) : (
                      <img
                        src="/assets/rightW.png"
                        alt="right"
                        onClick={handleNext}
                        className={`${styles.rightArrow} ${arrowActive.right ? styles.active : ''}`}
                      />
                    )}
                  </div>

                </div>
                }
            </div>
            }
         

        <canvas id="canvas-source" width="2160" height="3840" style={{ display: 'none' }}></canvas>
        <canvas id="canvas-blended" width="2160" height="3840" style={{ display: 'none' }}></canvas>
    </>
    )
    )}
    </div>
  )
}

export default TryOn

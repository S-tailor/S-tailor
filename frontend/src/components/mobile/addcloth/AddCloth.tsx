import React, { useState, useEffect, useMemo, startTransition, useRef, CSSProperties } from 'react'
import userStore from '@/store/store'
import { closetImgSearch, closetTextSearch, closetItemSave } from '@/api/apiCloset'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../../../scss/addcloth.module.scss'

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

type CameraMode = 'user' | 'environment'

const AddCloth: React.FC = () => {
  const location = useLocation()
  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[]
  }
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [, setMessage] = useState('')
  const [selectedCloths, setSelectedCloths] = useState<SelectedClothItem[]>([])
  const [showResults, setShowResults] = useState(false)
  const [imagePath, setImagePath] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [captureMode, setCaptureMode] = useState(false)
  const [searchMode, setSearchMode] = useState<'text' | 'upload' | 'camera' | null>(null)
  const [, setImageReady] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  // 카메라 켜기
  const videoRef = useRef<HTMLVideoElement>(null)
  const [camera, setCamera] = useState<CameraMode>('environment')
  const [stream, setStream] = useState<MediaStream | null>(null)

  const CameraClick = async (newCamera: CameraMode = camera) => {
    const constraints = { video: { facingMode: newCamera } }
    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(newStream)
      const video = videoRef.current
      if (video) {
        video.srcObject = newStream
        // video.play().catch((error) => console.error('비디오 재생 오류:', error))
      }
    } catch (error) {
      console.error('카메라 접근 오류:', error)
    }
  }

  // 비디오 요소 초기화 및 스트림 설정
  useEffect(() => {
    if (videoRef.current && stream) {
      const video = videoRef.current
      // 비디오 요소가 재생 중이지 않은 경우에만 재생
      if (video.paused) {
        video.srcObject = stream
        video.play().catch((error) => console.error('비디오 재생 오류:', error))
      }
    }
  }, [stream])

  // 사진 촬영
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

  const onCameraClick = async () => {
    if (cameraActive && captureMode) {
      await handleCapture()
      setCaptureMode(false) // 사진 촬영 후 이미지 보여주기 위해 변경
    } else {
      try {
        setCameraActive(true)
        setCaptureMode(true)
        setSearchMode('camera')
        await CameraClick()
      } catch (error) {
        console.error('Camera failed to start:', error)
      }
    }
  }

  // 카메라 전환
  const toggleCamera = () => {
    setCamera((prevCamera) => {
      const newCamera = prevCamera === 'environment' ? 'user' : 'environment'
      const video = videoRef.current
      if (video && video.srcObject) {
        // 이전 스트림 중지
        const tracks = (video.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
      CameraClick(newCamera) // CameraClick을 호출하여 새로운 camera 상태에 따라 재설정
      // if (video && video.srcObject && video.paused) {
      //   video.play().catch((error) => console.error('비디오 재생 오류:', error))
      // }
      return newCamera
    })
  }

  // 전면 카메라 사용시 거울 모드 적용
  const videoStyle: CSSProperties = useMemo(
    () => ({
      width: '100vw',
      height: '53vh',
      objectFit: 'cover',
      transform: camera === 'user' ? 'scaleX(-1)' : 'none' // 여기서 camera 상태에 따라 조건부 스타일 적용
    }),
    [camera]
  ) // camera 상태가 변경될 때마다 videoStyle 업데이트

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

  const profilePk = sessionStorage.getItem('profilePk')

  // 옷 저장
  const handleSaveCloths = async () => {
    for (const cloth of selectedCloths) {
      try {
        await closetItemSave({
          price: cloth.price,
          thumbNail: cloth.image,
          name: cloth.title,
          link: cloth.link,
          profilePk: profilePk,
          source: cloth.source
        })
      } catch (error) {
        setMessage('저장에 실패했습니다.')
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
    setIsLoading(true)
    const response = await closetTextSearch(text)

    updateResults(response.data.result)
    setShowResults(true)
    setIsLoading(false)
  }

  // 업로드 이미지 저장
  function saveImage(input: any) {
    let file: any
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
        setImagePath(reader.result as string)
        setUploadedFile(file)
        setImageReady(true)
        setSearchMode('upload')
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (uploadedFile) {
      // 이미지가 표시된 후 confirm 창 띄우기
      setTimeout(() => {
        if (confirm('해당 사진으로 검색하시겠습니까?')) {
          imageSearch(uploadedFile) // 이미지 검색 함수 실행
          setIsLoading(true)
        }
        setUploadedFile(null) // 중복 실행 방지
        setImageReady(false) // 상태 초기화
      }, 100)
    }
  }, [uploadedFile])

  // 이미지 업로드 검색
  async function imageSearch(file: any) {
    const formdata = new FormData()
    formdata.append('image', file)
    // if (image) {
    //   formdata.append('image', file)
    // }

    try {
      const response = await closetImgSearch(formdata)
      updateResults(response.data.result)
      setShowResults(true)
    } catch (error) {
      console.log('이미지 검색 실패:', error)
    }
    setIsLoading(false)
    // setCount(response.data.result.length)
  }

  // 업로드 이미지 띄우기
  function RenderUploadedImage() {
    return (
      <div>
        <img src={imagePath} style={videoStyle}></img>
      </div>
    )
  }

  // 검색 결과 렌더링
  function RenderResult() {
    if (results.length === 0) {
      return (
        <div className={styles.searchNoResults}>
          <p>검색 결과가 없습니다!</p>
        </div>
      )
    }

    return (
      <div className={styles.searchClothes}>
        {results.map((item: SearchResultItem, index: number) => (
          <div key={index} className={styles.resultItem}>
            <img
              className={styles.resultItemImg}
              src={item.image}
              alt={item.title}
              onClick={() => handleSelectCloth(item)}
            />
            <p className={styles.clothesSource}>{item.source}</p>
            <p className={styles.clothesName}>{item.title}</p>
            <p className={styles.clothesPrice}>{item.price.substring(1).replace(/\*/g, '')}원</p>
          </div>
        ))}
      </div>
    )
  }

  /////////// 하단 내비게이션 바 선택 시 아이콘(컬러) 변경 //////////////
  const getIconSrc = (iconName: string) => {
    const path = location.pathname
    const iconPaths: { [key: string]: { [icon: string]: string } } = {
      '/mobile/closet': {
        closet: '/assets/closetFill.png',
        'add-cloth': '/assets/upload.png',
        ask: '/assets/shirt.png',
        mypage: user[0]?.image || '/assets/avatar.PNG'
      },
      '/mobile/add-cloth': {
        closet: '/assets/closet.png',
        'add-cloth': '/assets/uploadFill.png',
        ask: '/assets/shirt.png',
        mypage: user[0]?.image || '/assets/avatar.PNG'
      },
      '/mobile/ask': {
        closet: '/assets/closet.png',
        'add-cloth': '/assets/upload.png',
        ask: '/assets/shirtFill.png',
        mypage: user[0]?.image || '/assets/avatar.PNG'
      },
      '/mobile/mypage': {
        closet: '/assets/closet.png',
        'add-cloth': '/assets/upload.png',
        ask: '/assets/shirt.png',
        mypage: user[0]?.image || '/assets/avatar.PNG'
      }
    }
    return iconPaths[path][iconName] || '/assets/' + iconName + '.png'
  }

  const getMypageImgStyle = useMemo(() => {
    return location.pathname === '/mobile/mypage'
      ? { border: '2px solid #9091FB', width: '9.5vw', height: '4.5vh', marginTop: '-2px' }
      : { filter: 'drop-shadow(0px 0px 1.5px #000000)' }
  }, [location.pathname])

  const getActiveStyle = (path: string) => {
    return location.pathname === path
      ? { fontFamily: 'Pretendard-Bold', color: '#9091FB', marginTop: '2px' }
      : {}
  }
  ////////////////////////////////////////////////////////////////////

  const goCloset = () => {
    startTransition(() => {
      navigate('/mobile/closet')
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerInner1}>
            <img onClick={goCloset} className={styles.logo} src="/assets/logo.png" alt="logo" />
          </div>
        </div>

        <div className={styles.searchbar}>
          <input
            className={styles.searchbarInner}
            type="text"
            onChange={(e) => saveText(e)}
            placeholder="텍스트로 상품을 검색해보세요."
            // autoFocus
          />
          <img
            className={styles.search}
            src="/assets/search.svg"
            alt="search"
            onClick={() => textSearch()}
          />
        </div>

        <div className={styles.infomation}>
          <p className={styles.infomationText}>
            <u>
              <a
                onClick={() => {
                  startTransition(() => {
                    navigate('/mobile/closet/code/input/test')
                  })
                }}
              >
                옷 입어보기
              </a>
            </u>{' '}
            기능의 최상의 결과를 위해 <b>'깔끔한 배경'</b>, <b>'1장'</b>인 옷을 선택해주세요.
          </p>
        </div>

      </div>

      <section className={styles.addClothMain}>


        {isLoading && (
          <div className={styles.loadingInner}>
            <img className={styles.loading} src="/assets/loading.gif" alt="로딩중" />
          </div>
        )}

        <div className={styles.picture}>
          {showResults ? (
            <RenderResult />
          ) : searchMode === 'camera' && cameraActive ? (
            <video ref={videoRef} style={videoStyle} autoPlay />
          ) : searchMode === 'upload' ? (
            <RenderUploadedImage />
          ) : null}
        </div>

        <div className={styles.pictureButtons}>
          {showResults ? (
            selectedCloths.length > 0 ? (
              selectedCloths.map((cloth) => (
                <div className={styles.selected} key={cloth.link}>
                  <img className={styles.selectedImg} src={cloth.image} alt={cloth.title} />
                  <div className={styles.seletedTexts}>
                    <p className={styles.selectedSource}>{cloth.source}</p>
                    <h4 className={styles.selectedTitle}>{cloth.title}</h4>
                    <p className={styles.selectedPrice}>
                      {cloth.price.substring(1).replace(/\*/g, '')}원
                    </p>
                    <div className={styles.selectedBtn}>
                      <img
                        className={styles.selectedDeleteBtn}
                        onClick={() => handleSelectCloth(cloth)}
                        src="/assets/closeBtn.svg"
                        alt="close"
                      />
                      <button className={styles.selectedAddBtn} onClick={handleSaveCloths}>
                        옷장에 추가
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noSelectionContainer}>
                <p className={styles.noSelection}>선택한 옷이 여기에 표시됩니다 :)</p>
              </div>
            )
          ) : (
            <>
              <label htmlFor="gallery">
                <img className={styles.gallery} src="/assets/gallery.png" alt="gallery" />
                <input id="gallery" type="file" onChange={saveImage}></input>
              </label>
              <img
                className={styles.camera}
                src={captureMode ? '/assets/camerashot.png' : '/assets/camera.png'}
                alt={captureMode ? 'capture' : 'camera'}
                onClick={onCameraClick}
              />
              <img
                className={styles.switch}
                src="/assets/switch.png"
                alt="switch"
                onClick={toggleCamera}
              />
            </>
          )}
        </div>
      </section>

      <footer className={styles.bottomNav}>
        <div className={styles.bottomNavInner}>
          <label className={styles.bottomNavInnerBtn}>
            <img
              className={styles.closetImg}
              src={getIconSrc('closet')}
              alt="closet-home"
              onClick={() => {
                startTransition(() => {
                  navigate('/mobile/closet')
                })
              }}
            />
            <p className={styles.bottomNavLabel1} style={getActiveStyle('/mobile/closet')}>
              옷장 홈
            </p>
          </label>

          <label className={styles.bottomNavInnerBtn}>
            <img
              className={styles.addClothesImg}
              src={getIconSrc('add-cloth')}
              alt="clothes-add"
              onClick={() => {
                startTransition(() => {
                  navigate('/mobile/add-cloth')
                })
              }}
            />
            <p className={styles.bottomNavLabel2} style={getActiveStyle('/mobile/add-cloth')}>
              옷 추가하기
            </p>
          </label>

          <label className={styles.bottomNavInnerBtn}>
            <img
              className={styles.recommendImg}
              src={getIconSrc('ask')}
              alt="style-recomm"
              onClick={() => {
                startTransition(() => {
                  navigate('/mobile/ask')
                })
              }}
            />
            <p className={styles.bottomNavLabel3} style={getActiveStyle('/mobile/ask')}>
              스타일추천
            </p>
          </label>

          <label className={styles.bottomNavInnerBtn}>
            <img
              className={styles.mypageImg}
              src={getIconSrc('mypage')}
              alt="myPage"
              style={getMypageImgStyle}
              onClick={() => {
                startTransition(() => {
                  navigate('/mobile/mypage')
                })
              }}
            />
            <p className={styles.bottomNavLabel4} style={getActiveStyle('/mobile/mypage')}>
              마이페이지
            </p>
          </label>
        </div>
      </footer>
    </div>
  )
}

export default AddCloth

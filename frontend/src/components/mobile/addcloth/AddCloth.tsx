import React, { useState, useEffect, useMemo, startTransition, useRef } from 'react'
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
  // const [isLoading, setIsLoading] = useState(true);
  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[]
  }
  const navigate = useNavigate()
  const [, setImage] = useState(null)
  const [text, setText] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [, setMessage] = useState('')
  const [selectedCloths, setSelectedCloths] = useState<SelectedClothItem[]>([])
  const [showResults, setShowResults] = useState(false)
  const [imagePath, setImagePath] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [captureMode, setCaptureMode] = useState(false)

  // 카메라 켜기
  const videoRef = useRef<HTMLVideoElement>(null)
  const [camera, setCamera] = useState<CameraMode>('environment')

  const CameraClick = async () => {
    const constraints = { video: { facingMode: camera } }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      const video = videoRef.current

      if (video) {
        video.srcObject = stream
        setCameraActive(true)
        setCaptureMode(true) // 촬영 모드로 전환
      }
    } catch (error) {
      console.error('카메라 접근 오류:', error)
    }
  }
  // 사진 촬영
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

  const onCameraClick = () => {
    if (cameraActive && captureMode) {
      handleCapture()
    } else {
      CameraClick()
    }
  }

  // 카메라 전환
  const toggleCamera = () => {
    setCamera((prevCamera) => (prevCamera === 'environment' ? 'user' : 'environment'))
    const video = videoRef.current
    if (video && video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    CameraClick()
  }

  // 전면 카메라 사용시 거울 모드 적용
  const videoStyle = {
    width: '100%',
    transform: camera === 'user' ? 'scaleX(-1)' : 'none'
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
  const profilePk = (sessionStorage.getItem('profilePk'))

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
    const response = await closetTextSearch(text)
   
    updateResults(response.data.result)
  }

  // 업로드 이미지 저장
  function saveImage(event: any) {
    const file = event.target.files[0]

    if (event.target.files) {
      setImage(file)
    }
    console.log(event)

    const reader = new FileReader()
    reader.onload = () => {
      setImagePath(reader.result as string)
      setUploadedFile(file)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (uploadedFile) {
      // 이미지가 표시된 후 confirm 창 띄우기
      setTimeout(() => {
        if (confirm('해당 사진으로 검색하시겠습니까?')) {
          imageSearch(uploadedFile) // 이미지 검색 함수 실행
        }
        setUploadedFile(null) // 중복 실행 방지
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

    // setCount(response.data.result.length)
  }

  // 업로드 이미지 띄우기
  function RenderImage() {
    return (
      <div>
        <img src={imagePath}></img>
      </div>
    )
  }

  // 검색 결과 렌더링
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

  /////////// 하단 내비게이션 바 선택 시 아이콘(컬러) 변경 //////////////
  const getIconSrc = (iconName: string) => {
    const path = location.pathname
    const iconPaths: { [key: string]: { [icon: string]: string } } = {
      '/mobile/closet': {
        closet: '/src/assets/closetFill.png',
        'add-cloth': '/src/assets/upload.png',
        ask: '/src/assets/shirt.png',
        mypage: user[0]?.image || '/src/assets/avatar.PNG'
      },
      '/mobile/add-cloth': {
        closet: '/src/assets/closet.png',
        'add-cloth': '/src/assets/uploadFill.png',
        ask: '/src/assets/shirt.png',
        mypage: user[0]?.image || '/src/assets/avatar.PNG'
      },
      '/mobile/ask': {
        closet: '/src/assets/closet.png',
        'add-cloth': '/src/assets/upload.png',
        ask: '/src/assets/shirtFill.png',
        mypage: user[0]?.image || '/src/assets/avatar.PNG'
      },
      '/mobile/mypage': {
        closet: '/src/assets/closet.png',
        'add-cloth': '/src/assets/upload.png',
        ask: '/src/assets/shirt.png',
        mypage: user[0]?.image || '/src/assets/avatar.PNG'
      }
    }
    return iconPaths[path][iconName] || '/src/assets/' + iconName + '.png'
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
      <header>
        <div className={styles.headerInner}>
          <div className={styles.headerInner1}>
            <img onClick={goCloset} className={styles.logo} src="/src/assets/logo.png" alt="logo" />
          </div>
        </div>
      </header>

      <section className={styles.addClothMain}>
        <div className={styles.searchbar}>
          <input
            className={styles.searchbarInner}
            type="text"
            onChange={(e) => saveText(e)}
            placeholder="텍스트로 상품을 검색해보세요."
            autoFocus
          />
          <img
            className={styles.search}
            src="/src/assets/search.svg"
            alt="search"
            onClick={() => textSearch()}
          />
        </div>

        <div className={styles.picture}>{showResults ? <RenderResult /> : <RenderImage />}</div>

        <div className={styles.pictureButtons}>
          {showResults ? ( 
            selectedCloths.map((cloth) => (
              <div className={styles.selected} key={cloth.link}>
                <img className={styles.selectedImg} src={cloth.image} alt={cloth.title} />
                <div className={styles.seletedTexts}>
                  <p className={styles.selectedSource}>{cloth.source}</p>
                  <h4 className={styles.selectedTitle}>{cloth.title}</h4>
                  <p className={styles.selectedPrice}>{cloth.price}</p>
                  <div className={styles.selectedBtn}>
                    <img
                      className={styles.selectedDeleteBtn}
                      onClick={() => handleSelectCloth(cloth)}
                      src="/src/assets/closeBtn.svg"
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
            <>
              <label htmlFor="gallery">
                <img className={styles.gallery} src="/src/assets/gallery.png" alt="gallery" />
                <input id="gallery" type="file" onChange={saveImage}></input>
              </label>
              <img
                className={styles.camera}
                src={captureMode ? '/src/assets/avatar.png' : '/src/assets/camera.png'}
                alt={captureMode ? 'capture' : 'camera'}
                onClick={onCameraClick}
              />
              {cameraActive && (
                <video
                  ref={videoRef}
                  style={videoStyle} // 여기에 스타일을 적용합니다.
                  autoPlay
                ></video>
              )}
              <img
                className={styles.switch}
                src="/src/assets/switch.png"
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

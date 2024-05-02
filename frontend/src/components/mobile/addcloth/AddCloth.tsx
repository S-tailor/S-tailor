import React, { useState, useMemo, startTransition, useRef } from 'react'
import userStore from '@/store/store'
import { closetImgSearch, closetTextSearch, closetItemSave } from '@/api/apiCloset'
// import userStore from '@/store/store'
// import Pagination from 'react-js-pagination'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../../../scss/addcloth.module.scss';

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
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[];
  };
  const userName= user[0]?.profileName  ?? 'Guest'
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [message, setmessage] = useState('')
  const [selectedCloths, setSelectedCloths] = useState<SelectedClothItem[]>([])
  const [showResults, setShowResults] = useState(false)
  // const [count, setCount] = useState(1)

  // 카메라
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
        setmessage('저장에 실패했습니다.')
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
    setShowResults(true)
  }

  // 업로드 이미지 저장
  function saveImage(event: any) {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
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
    setShowResults(true)
  }

  // 결과 렌더링
  function RenderResult() {
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
            <p className={styles.clothesPrice}>{item.price}</p>
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
        'closet': '/src/assets/closetFill.png',
        'add-cloth': '/src/assets/upload.png',
        'ask': '/src/assets/shirt.png',
        'mypage': user[0]?.image || "/src/assets/avatar.PNG"
      },
      '/mobile/add-cloth': {
        'closet': '/src/assets/closet.png',
        'add-cloth': '/src/assets/uploadFill.png',
        'ask': '/src/assets/shirt.png',
        'mypage': user[0]?.image || "/src/assets/avatar.PNG"
      },
      '/mobile/ask': {
        'closet': '/src/assets/closet.png',
        'add-cloth': '/src/assets/upload.png',
        'ask': '/src/assets/shirtFill.png',
        'mypage': user[0]?.image || "/src/assets/avatar.PNG"
      },
      '/mobile/mypage': {
        'closet': '/src/assets/closet.png',
        'add-cloth': '/src/assets/upload.png',
        'ask': '/src/assets/shirt.png',
        'mypage': user[0]?.image || "/src/assets/avatar.PNG"
      }
    }
    return iconPaths[path][iconName] || '/src/assets/' + iconName + '.png';
  }

  const getMypageImgStyle = useMemo(() => {
    return location.pathname === '/mobile/mypage' ? { border: '2px solid #9091FB', width: '9.5vw', height: '4.5vh', marginTop: '-2px'} : { filter: 'drop-shadow(0px 0px 1.5px #000000)' };
  }, [location.pathname])

  const getActiveStyle = (path: string) => {
    return location.pathname === path ? { fontFamily: 'Pretendard-Bold', color: '#9091FB', marginTop: '2px' } : {}
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

        <div className={styles.picture}>
          {showResults && <RenderResult />}
        </div>

        <div className={styles.pictureButtons}>
          {showResults ? (
            selectedCloths.map(cloth => (
              <div className={styles.selected} key={cloth.link}>
                <img className={styles.selectedImg} src={cloth.image} alt={cloth.title} />
                <div className={styles.seletedTexts}>
                  <p className={styles.selectedSource}>{cloth.source}</p>
                  <h4 className={styles.selectedTitle}>{cloth.title}</h4>
                  <p className={styles.selectedPrice}>{cloth.price}</p>
                  <div className={styles.selectedBtn}>
                    <img className={styles.selectedDeleteBtn} onClick={() => handleSelectCloth(cloth)} src="/src/assets/closeBtn.svg" alt="close" />
                    <button className={styles.selectedAddBtn} onClick={handleSaveCloths}>옷장에 추가</button>
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
              <img className={styles.camera} src="/src/assets/camera.png" alt="camera" onClick={imageSearch} />
              <img className={styles.switch} src="/src/assets/switch.png" alt="switch" onClick={imageSearch} />
            </>
          )}
        </div>

      </section>
      
      {/* <section className={styles.searchClothes}>
    <div>
      <h1>AddCloth Component</h1>
      <div>
        <button onClick={CameraClick}>카메라 켜기</button>
        <button onClick={handleCapture}>사진 촬영</button>
        <button onClick={toggleCamera}>카메라 전환</button>
        <video ref={videoRef} autoPlay playsInline style={videoStyle}></video>
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
      <RenderResult />
      </section> */}

      {/* <Pagination totalItemsCount={count} onChange={(e) => console.log(e)}></Pagination> */}
    
        
      <footer className={styles.bottomNav}>
        <div className={styles.bottomNavInner}>
            <label className={styles.bottomNavInnerBtn}>
              <img 
                className={styles.closetImg}
                src={getIconSrc('closet')}
                alt="closet-home" 
                onClick={()=>{
                startTransition(()=>{
                  navigate('/mobile/closet')})} 
                }
              />
              <p className={styles.bottomNavLabel1} style={getActiveStyle('/mobile/closet')}>옷장 홈</p>
            </label>
           
            <label className={styles.bottomNavInnerBtn}>
              <img 
                className={styles.addClothesImg}
                src={getIconSrc('add-cloth')} 
                alt="clothes-add" 
                onClick={()=>{
                startTransition(()=>{
                  navigate('/mobile/add-cloth')})} 
                }
              />
              <p className={styles.bottomNavLabel2} style={getActiveStyle('/mobile/add-cloth')}>옷 추가하기</p>
            </label>

            <label className={styles.bottomNavInnerBtn}>
              <img 
                className={styles.recommendImg}
                src={getIconSrc('ask')} 
                alt="style-recomm" 
                onClick={()=>{
                startTransition(()=>{
                  navigate('/mobile/ask')})} 
                }
              />
              <p className={styles.bottomNavLabel3} style={getActiveStyle('/mobile/ask')}>스타일추천</p>
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
              <p className={styles.bottomNavLabel4} style={getActiveStyle('/mobile/mypage')}>마이페이지</p>
            </label>
        </div>
      </footer>

    </div>
  )
}

export default AddCloth

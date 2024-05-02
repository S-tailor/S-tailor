import React, { useState, useMemo, startTransition } from 'react'
import userStore from '@/store/store'
import { closetImgSearch, closetTextSearch, closetItemSave } from '@/api/apiCloset'
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

  // 옷 저장
  const handleSaveCloths = async () => {
    for (const cloth of selectedCloths) {
      try {
        const response = await closetItemSave({
          price: cloth.price,
          image: cloth.image,
          title: cloth.title,
          link: cloth.link,
          source: cloth.source
        })
        setmessage('저장이 완료 되었습니다.')
        console.log('저장 성공', response.data)
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
    // setCount(response.data.result.length)
    console.log(response.data.result)
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
    console.log(response)
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

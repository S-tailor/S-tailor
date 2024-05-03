import React, { useState, useMemo, startTransition, useEffect } from 'react'
import userStore from '@/store/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { cartItemAdd } from '@/api/apiCart'
import styles from '../../../scss/mypage.module.scss';

const MyPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [cartCount, setCartCount] = useState<number>(0)
  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[];
  };
  const userName= user[0]?.profileName  ?? 'Guest'

  // 프로필 이름

  const profileName = user[0]?.profileName ?? 'Guest'
  // 프로필 사진
  const profileImg = user[0]?.image

  const ClosetSearchClick = () => {
    startTransition(() => {
      navigate('/mobile/closet/search')
    })
  }

  const ProfileChangeClick = () => {
    startTransition(() => {
      navigate('/mobile/profile')
    })
  }

  const LogoutClick = () => {
    startTransition(() => {
      // 로그아웃 전, accessToken의 존재 여부 확인
      // console.log('로그아웃 전 accessToken:', window.localStorage.getItem('accessToken'))

      // accessToken 삭제로 로그아웃
      window.localStorage.removeItem('accessToken')

      // 로그아웃 후, accessToken이 제거되었는지 확인
      console.log('로그아웃 후 accessToken:', window.localStorage.getItem('accessToken'))

      navigate('/mobile/start')
    })
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
    return location.pathname === path ? { fontFamily: 'Pretendard-Bold', color: '#9091FB', marginTop: '1px' } : {}
  }
  ////////////////////////////////////////////////////////////////////

  const CameraClick = () => {
    startTransition(() => {
      navigate('/mobile/camera')
    })
  }


  const addCart = async (pk: number) => {
    await cartItemAdd(pk)
      .then(() => {
        alert('장바구니에 추가되었습니다!')
        const newCartCount = cartCount + 1
        localStorage.setItem('cartCount', JSON.stringify(newCartCount))
        setCartCount(newCartCount)
      })
  }

  useEffect(() => {
    const storedCartCount = localStorage.getItem('cartCount')
    if (storedCartCount) {
      setCartCount(JSON.parse(storedCartCount))
    }
  }, [])


  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <div className={styles.headerInner}>
        <div className={styles.headerInner1}>
        <img className={styles.logo} src="/src/assets/mypage.png" alt="logo" />
        </div>
    
        <div className={styles.headerInner2}>
          <img 
            className={styles.search}
            src="/src/assets/search.svg" 
            alt="search"
            onClick={ClosetSearchClick}  
          />
        </div>
        
        <div className={styles.headerInner3}>
          <img 
            className={styles.cart}
            src="/src/assets/shoppingbag.svg" 
            alt="cart"
            onClick={()=>{
              startTransition(()=>{
              navigate('/mobile/closet/wishlist')}
              )}} 
          />
          <span className={styles.cartAdd}>{cartCount}</span>
        </div>

        </div>
      </div>

      <section className={styles.mypageMain}>
        <div className={styles.profile}>
          <img className={styles.profileImg} src={profileImg} alt="프로필 이미지" />
          <p>{profileName}</p>
        </div>
        <div className={styles.bottons}>
          <button className={styles.changeBtn} onClick={ProfileChangeClick}>
            <img className={styles.profileChange} src="/src/assets/profileChange.svg" alt="profileChange" />
            <span>프로필 변경</span>
          </button>
          <button className={styles.logoutBtn} onClick={LogoutClick}>
            <img className={styles.logout} src="/src/assets/logout.svg" alt="logout" />
            <span>로그아웃</span>
          </button>
          {/* <button onClick={CameraClick}>카메라</button> */}
        </div>

        <div>
          {/* <h3>2D 가상 피팅 결과 사진 확인</h3> */}
        </div>
      </section>

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

export default MyPage

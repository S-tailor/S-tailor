import React, { useMemo, startTransition } from 'react'
import userStore from '@/store/store'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../../../scss/mypage.module.scss'

const MyPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[]
  }
  // const userName = user[0]?.profileName ?? 'Guest'

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
      ? { fontFamily: 'Pretendard-Bold', color: '#9091FB', marginTop: '1px' }
      : {}
  }
  ////////////////////////////////////////////////////////////////////

  return (
    <div>
      {/* 검색 아이콘으로 변경 필요 */}
      <button onClick={ClosetSearchClick}>옷장 검색</button>

      <button onClick={ProfileChangeClick}>프로필 변경</button>
      <button onClick={LogoutClick}>로그아웃</button>
      <div>
        <img src={profileImg} alt="프로필 이미지" />
        <h3>{profileName}</h3>
      </div>
      <h1>MyPage Component</h1>
      <div>
        <h3>2D 가상 피팅 결과 사진 확인</h3>
      </div>

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

export default MyPage

import React, { useMemo, startTransition } from 'react'
import userStore from '@/store/store'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../../../scss/mypage.module.scss'

const MyPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount } = userStore()
  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[]
  }
  const profileName = user[0]?.profileName ?? 'Guest'
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
      window.localStorage.removeItem('accessToken')
      navigate('/mobile/start')
    })
  }

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
      ? { border: '2px solid #9091FB', width: '35px', height: '35px', marginTop: '-2px' }
      : { filter: 'drop-shadow(0px 0px 1.5px #000000)' }
  }, [location.pathname])

  const getActiveStyle = (path: string) => {
    return location.pathname === path
      ? { fontFamily: 'Pretendard-Bold', color: '#9091FB', marginTop: '3px' }
      : {}
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerInner1}>
            <img className={styles.logo} src="/assets/mypage.png" alt="logo" />
          </div>

          <div className={styles.headerInner2}>
            <img
              className={styles.search}
              src="/assets/search.svg"
              alt="search"
              onClick={ClosetSearchClick}
            />
          </div>

          <div className={styles.headerInner3}>
            <img
              className={styles.cart}
              src="/assets/shoppingbag.svg"
              alt="cart"
              onClick={() => {
                startTransition(() => {
                  navigate('/mobile/closet/wishlist')
                })
              }}
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
            <img
              className={styles.profileChange}
              src="/assets/profileChange.svg"
              alt="profileChange"
            />
            <span>프로필 변경</span>
          </button>
          <button className={styles.logoutBtn} onClick={LogoutClick}>
            <img className={styles.logout} src="/assets/logout.svg" alt="logout" />
            <span>로그아웃</span>
          </button>
        </div>

        <div></div>
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

          <label className="{styles.bottomNavInnerBtn}">
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

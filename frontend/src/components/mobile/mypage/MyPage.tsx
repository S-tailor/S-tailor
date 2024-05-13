import React, { useMemo, startTransition, useEffect, useState } from 'react'
import userStore from '@/store/store'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../../../scss/mypage.module.scss'
import { myPageTryonList } from '@/api/apiMyPage'
import { cartItemList, cartItemAdd } from '@/api/apiCart'

const MyPage: React.FC = () => {
  interface clothInfo {
    name: string
    price: string
    image?: string
    link: string
    closetPk: number
    source: string
  }

  interface tryonInfo {
    tryonPk: number
    profilePk: number
    closetPk: number
    generatedImage: string
  }

  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, updateCartList, addToCart } = userStore()
  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[]
  }

  const profileName = user[0]?.profileName ?? 'Guest'
  const profileImg = user[0]?.image
  const profilePk = Number(user[0]?.profilePk)
  const [clothList,] = useState<clothInfo[]>([])
  const [tryonList, setTryOnList] = useState<tryonInfo[]>([])
  const [closetList, setClosetList] = useState<clothInfo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false)

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
  
  const nextItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tryonList.length);
  };

  const prevItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + tryonList.length) % tryonList.length);
  };

  useEffect(() => {
    if (tryonList.length == 0) {
      makeList()
    }
  }, [])

  const makeList = async () => {
    setIsLoading(true)
    try {
      const response = await myPageTryonList(profilePk)
      setTryOnList(await response.data.tryonList)
      setClosetList(await response.data.closetList)
    } catch (error) {
    }
    setIsLoading(false)
  }

  const goShopping = (link: string) => {
    window.open(link, '_blank')
  }

  const addCart = async (pk: number) => {
    const response = await cartItemAdd(pk)
    if (response.status === 200) {
      const newItem = clothList.find((item) => item.closetPk === pk)
      if (newItem) {
        addToCart(newItem)
        updateCartCount()
        alert('위시리스트에 추가되었습니다!')
      }
    }
  }

  const updateCartCount = async () => {
    const profilePk = Number(sessionStorage.getItem('profilePk'))
    const response = await cartItemList(profilePk)
    if (response.status === 200) {
      const cartList = response.data.result
      updateCartList(cartList)
      userStore.getState().setCartCount(cartList.length)
    }
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
            <div className={styles.cartInner}>
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

          {tryonList.length > 0 && (
            <div className={styles.triedOnClothesContainer}>
              <div className={styles.tryonContent} key={currentIndex}>
                <img className={styles.tryonListImage} src={tryonList[currentIndex].generatedImage}></img>
                <img className={styles.previousBtn} onClick={prevItem} src="/assets/backBtn.svg" alt="backBtn" />
                <img className={styles.nextBtn} onClick={nextItem} src="/assets/backBtnRight.svg" alt="backBtnRight" />
              </div>
            
              <div className={styles.closetContent}> 
                <p className={styles.triedOnClothesText}>입어 본 상품</p>
                <img className={styles.closetListImage} src={closetList[currentIndex]?.image}></img>
                <p className={styles.sourceText}>{closetList[currentIndex]?.source}</p>
                <p className={styles.nameText}>{closetList[currentIndex]?.name}</p>
                <p className={styles.priceText}>{closetList[currentIndex]?.price.replace(/\*/g, '')}원</p>
                <button className={styles.wishListAddBtn} onClick={() => addCart(closetList[currentIndex].closetPk)}>위시리스트 추가</button>
                <button className={styles.goShoppingBtn} onClick={() => goShopping(closetList[currentIndex]?.link)}>구매하러가기</button>
              </div>
            </div>
          )}
          
          {isLoading && (
          <div className={styles.loadingInner}>
            <img className={styles.loading} src="/assets/loading.gif" alt="로딩 중" />
          </div>
          )}
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

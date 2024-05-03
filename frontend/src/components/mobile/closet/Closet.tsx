import React, { useEffect, startTransition, useState, useMemo } from 'react'
import userStore from '@/store/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { closetItemList, closetItemDelete } from '@/api/apiCloset'
import { cartItemAdd } from '@/api/apiCart'
import styles from '../../../scss/closet.module.scss'

const Closet: React.FC = () => {
  interface clothInfo {
    name: string
    price: string
    image?: string
    link: string
    closetPk: number
    source: string
  }

  const location = useLocation()
  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[]
  }
  const [clothList, setClothList] = useState<clothInfo[]>([])
  const navigate = useNavigate()
  const userName = user[0]?.profileName ?? 'Guest'
  const [isLoading, setIsLoading] = useState(true)
  const [cartCount, setCartCount] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const categories = ['전체', '아우터', '상의', '하의', '원피스', '기타']

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
  }

  useEffect(() => {
    const profilePk = Number(sessionStorage.getItem('profilePk'))
    if (profilePk) {
      fetchItem(profilePk)
    }
  }, [])

  const fetchItem = async (profilePk: number) => {
    await closetItemList(profilePk).then((response) => {
      setClothList(response.data.result)
      setTimeout(() => {
        setIsLoading(!isLoading)
      }, 500)
      setIsLoading(!isLoading)
    })
  }

  const deleteCloth = async (pk: number) => {
    const response = await closetItemDelete(pk)
    if (response.status === 200) {
      setClothList((currentList) => currentList.filter((item) => item.closetPk !== pk))
      alert('옷장에서 삭제되었습니다!')
    } else {
      console.error('Failed to delete', pk)
    }
  }

  const getCategoryStyle = (category: string) => {
    return category === selectedCategory ? { fontWeight: '700', color: '#424242' } : {}
  }

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

  const addCart = async (pk: number) => {
    await cartItemAdd(pk).then(() => {
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

  const goCloset = () => {
    startTransition(() => {
      navigate('/mobile/closet')
    })
  }

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.wait}>
          <img className={styles.loading} src="/src/assets/loading.gif" alt="로딩 중" />
          <p className={styles.loadingMessage}>MY CLOSET OPENING...</p>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.headerInner}>
              <div className={styles.headerInner1}>
                <img
                  onClick={goCloset}
                  className={styles.logo}
                  src="/src/assets/logo.png"
                  alt="logo"
                />
              </div>

              <div className={styles.headerInner2}>
                <img
                  className={styles.search}
                  src="/src/assets/search.svg"
                  alt="search"
                  onClick={() => {
                    startTransition(() => {
                      navigate('/mobile/closet/search')
                    })
                  }}
                />
              </div>

              <div className={styles.headerInner3}>
                <img
                  className={styles.cart}
                  src="/src/assets/shoppingbag.svg"
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

          <section className={styles.closetMain}>
            <div className={styles.mainCategory}>
              {categories.map((category) => (
                <a
                  key={category}
                  href="#"
                  onClick={() => handleCategoryClick(category)}
                  style={getCategoryStyle(category)}
                >
                  {category}
                </a>
              ))}
            </div>
            <div className={styles.slider}>
              <div className={styles.slide}></div>
              <div className={styles.slide}></div>
              <div className={styles.slide}></div>
            </div>
            <div className={styles.mainTitle}>
              <p className={styles.userName}>{userName} 님의 옷장</p>
            </div>
            <div className={styles.mainClothes}>
              <div className={styles.clothesContent}>
                {clothList.map((cloth, idx) => (
                  <div key={idx} className={styles.clothesItem}>
                    <img className={styles.clothesImg} src={cloth.image} alt="옷 사진" />
                    <div className={styles.addCartBtn} onClick={() => addCart(cloth.closetPk)}>
                      <img
                        className={styles.addCartBtnImg}
                        src="/src/assets/shoppingbagW.png"
                        alt="cart에 담기"
                      />
                    </div>
                    <div
                      className={styles.deleteCartBtn}
                      onClick={() => deleteCloth(cloth.closetPk)}
                    >
                      <img
                        className={styles.deleteCartBtnImg}
                        src="/src/assets/closeBtn.svg"
                        alt="deleteBtn"
                      />
                    </div>
                    <p className={styles.clothesName}>{cloth.name}</p>
                    <p className={styles.clothesPrice}>{cloth.price.substring(1)}원</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.wearingBtn}>
              <button
                className={styles.btn}
                onClick={() => {
                  startTransition(() => {
                    navigate('/mobile/closet/code/input')
                  })
                }}
              >
                옷 입어보기
              </button>
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
        </>
      )}
    </div>
  )
}

export default Closet

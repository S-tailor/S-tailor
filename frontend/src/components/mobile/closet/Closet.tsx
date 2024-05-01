import React,{ useEffect, startTransition, useState } from 'react'
import userStore from '@/store/store'
import { useNavigate } from 'react-router-dom'
import { closetItemList } from '@/api/apiCloset'
import { cartItemAdd } from '@/api/apiCart'
import styles from '../../../scss/closet.module.scss';

const Closet: React.FC = () => {
  interface UserProfile {
    profilePk: number;
    image?: string;
    profileName: string;
  }

  interface clothInfo {
    name: string,
    price: string,
    image?: string,
    link: string,
    closetPk: number

  }
  const{user, clearUsers} = userStore() as {user: UserProfile[], clearUsers: () => void};
  const [clothList, setClothList] = useState<clothInfo[]>([])
  const navigate = useNavigate()
  const userName= user[0]?.profileName  ?? 'Guest';
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState<number>(0)

  useEffect(() => {
    const profilePk = user[0]?.profilePk;
    if (profilePk) {
        fetchItem(profilePk)
        }
  }, []); 

  const fetchItem = async (profilePk: number) => {
    await closetItemList(profilePk)
        .then((response) => {
          setTimeout(() => {
            
            setClothList(response.data.result)
            setIsLoading(!isLoading)
          }, 100)
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
        
        <div className={styles.headerInner2}>
          <img 
            className={styles.search}
            src="/src/assets/search.svg" 
            alt="search"
            onClick={()=>{
              startTransition(()=>{
              navigate('/mobile/closet/search')}
              )}}  
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
      </header>
     
      <section className={styles.closetMain}>
        <div className={styles.mainCategory}>
          <a href="">전체</a>
          <a href="">아우터</a>
          <a href="">상의</a>
          <a href="">하의</a>
          <a href="">원피스</a>
          <a href="">기타</a>
        </div>
        <div className={styles.slider}>
          <div className={styles.slide}></div>
          <div className={styles.slide}></div>
          <div className={styles.slide}></div>          
        </div>
        <div className={styles.mainTitle}>
          <p className={styles.userName}>{userName} 님의 옷장</p>          
          <p className={styles.loadingMessage}>{isLoading ? "옷장 문 여는중..." : ""}</p>
        </div>
        <div className={styles.mainClothes}> 
          <div className={styles.clothesContent}>
            {clothList.map((cloth, idx) => (
              <div key={idx} className={styles.clothesItem}>
                <img className={styles.clothesImg} src={cloth.image} alt='옷 사진'/>
                <div className={styles.addCartBtn} onClick={() => addCart(cloth.closetPk)}>
                  <img className={styles.addCartBtnImg} src="/src/assets/shoppingbagW.png" alt="cart에 담기" />
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
            onClick={()=>{
            startTransition(()=>{
              navigate('/mobile/closet/code/input')
            })}}
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
                src="/src/assets/closet.svg" 
                alt="closet-home" 
                onClick={()=>{
                startTransition(()=>{
                  navigate('/mobile/closet')})} 
                }
              />
              <p className={styles.bottomNavLabel}>옷장 홈</p>
            </label>
           
            <label className={styles.bottomNavInnerBtn}>
              <img 
                className={styles.addClothesImg}
                src="/src/assets/upload.svg" 
                alt="clothes-add" 
                onClick={()=>{
                startTransition(()=>{
                  navigate('/mobile/add-cloth')})} 
                }
              />
              <p className={styles.bottomNavLabel}>옷 추가하기</p>
            </label>

            <label className={styles.bottomNavInnerBtn}>
              <img 
                className={styles.recommendImg}
                src="/src/assets/shirt.svg" 
                alt="style-recomm" 
                onClick={()=>{
                startTransition(()=>{
                  navigate('/mobile/ask')})} 
                }
              />
              <p className={styles.bottomNavLabel}>스타일추천</p>
            </label>

            <label className={styles.bottomNavInnerBtn}>
              <img 
                className={styles.mypageImg}
                src={user[0]?.image || "/src/assets/avatar.PNG"}
                alt="myPage" 
                onClick={() => {
                  startTransition(() => {
                    navigate('/mobile/mypage')
                  })
                }}
              />
              <p className={styles.bottomNavLabel}>마이페이지</p>
            </label>
        </div>
      </footer>

    </div>
  )
}

export default Closet

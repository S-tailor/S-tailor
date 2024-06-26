import React, { startTransition, useEffect, useState } from 'react'
import userStore from '@/store/store'
import { useNavigate } from 'react-router-dom'
import { cartItemList, cartItemDelete } from '@/api/apiCart'
import styles from '../../../scss/closetwishlist.module.scss'

const ClosetWishList: React.FC = () => {
  interface cartInfo {
    name: string
    price: string
    image?: string
    link: string
    closetPk: number
    source: string
  }
  const [cartList, setCartList] = useState<cartInfo[]>([])
  const navigate = useNavigate()
  const cartCount = cartList.length
  const [isLoading, setIsLoading] = useState(false)
  const goShopping = (link: string) => {
    window.open(link, '_blank')
  }

  useEffect(() => {
    setIsLoading(true)
    const profilePk = Number(sessionStorage.getItem('profilePk'))
    fetchCart(profilePk)
  }, [])

  const deleteItem = async (pk: number) => {
    const response = await cartItemDelete(pk)
    if (response.status === 200) {
      setCartList((currentList) => currentList.filter((item) => item.closetPk !== pk))
      userStore.getState().removeFromCart(pk)
      alert('위시리스트에서 삭제되었습니다!')
    } else {
      console.error('Failed to delete', pk)
    }
  }

  const fetchCart = async (pk: number) => {
    await cartItemList(pk).then((response) => {
    
        setCartList(response.data.result)

    })
    setIsLoading(false)
  }

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
            <img
              onClick={goCloset}
              className={styles.backBtn}
              src="/assets/backBtn.svg"
              alt="backBtn"
            />
          </div>

          <div className={styles.headerInner2}>
            <p className={styles.title}>위시리스트</p>
          </div>

          <div className={styles.headerInner3}></div>
        </div>
      </div>

      <div className={styles.main}>
        <p className={styles.length}>위시리스트에 {cartCount}개의 상품이 있습니다.</p>
        {isLoading &&
          <div className={styles.loadingInner}>
            <img className={styles.loading} src="/assets/loading.gif" alt="로딩중" />
          </div>
        }

        {cartList.map((item, idx) => (
          <div className={styles.selected} key={idx}>
            {item.image && <img className={styles.selectedImg} src={item.image} alt="옷 사진" />}

            <div className={styles.seletedTexts}>
              <p className={styles.selectedSource}>{item.source}</p>
              <h4 className={styles.selectedTitle}>{item.name}</h4>
              <p className={styles.selectedPrice}>{item.price.substring(1).replace(/\*/g, '')}원</p>
              <div className={styles.selectedBtn}>
                <img
                  className={styles.selectedDeleteBtn}
                  src="/assets/closeBtn.svg"
                  alt="delete-item"
                  onClick={() => deleteItem(item.closetPk)}
                />
                <button className={styles.selectedAddBtn} onClick={() => goShopping(item.link)}>
                  구매하러가기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClosetWishList

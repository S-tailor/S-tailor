import React,{ startTransition, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartItemList, cartItemDelete } from '@/api/apiCart'
import styles from '../../../scss/closetwishlist.module.scss'

const ClosetWishList: React.FC = () => {
  interface cartInfo {
    name: string,
    price: string,
    image?: string,
    link: string,
    closetPk: number,
    source: string,
  }
  const[cartList, setCartList] = useState<cartInfo[]>([])
  const[isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()




  const goShopping = (link:string) => {
   
    window.open(link, '_blank');
  }
  
  const profilePk = Number(sessionStorage.getItem('profilePk'))
  useEffect(()=>{
      fetchCart(profilePk)
  },[])

  const deleteItem = async (pk: number) => {
    const response = await cartItemDelete(pk);
    if (response.status === 200) { 
      setCartList(currentList => currentList.filter(item => item.closetPk !== pk));
      alert('장바구니에서 삭제되었습니다!')
    } else {
      console.error('Failed to delete', pk);
    }
  };


  const fetchCart = async (pk:number) => {
    await cartItemList(pk)
    .then((response) => {
      setTimeout(() => {
        setCartList(response.data.result)
        setIsLoading(false)
      },500)
    })
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
              <img onClick={goCloset} className={styles.backBtn} src="/src/assets/backBtn.svg" alt="backBtn" />
            </div>
        
            <div className={styles.headerInner2}>
              <p className={styles.title}>위시리스트</p>
            </div>
            
            <div className={styles.headerInner3}>
            </div>

        </div>
      </div>


      {/* {isLoading? "장바구니 불러오는중...":""} */}
    <div className={styles.main}>
      {cartList.length > 0 && (
        <p className={styles.length}>
          장바구니에 {cartList.length}개의 상품이 있습니다.
        </p>
      )}
      

        {cartList.map((item, idx) => (
    
          <div className={styles.selected} key={idx}>

              {item.image && <img className={styles.selectedImg} src={item.image} alt='옷 사진'/>}
              
              <div className={styles.seletedTexts}>
                <p className={styles.selectedSource}>{item.source}</p>
                <h4 className={styles.selectedTitle}>{item.name}</h4> 
                <p className={styles.selectedPrice}>{item.price}원</p>
                <div className={styles.selectedBtn}>
                  <img 
                    className={styles.selectedDeleteBtn}
                    src="/src/assets/closeBtn.svg" 
                    alt="delete-item" 
                    onClick={()=>deleteItem(item.closetPk)} 
                  />
                  <button className={styles.selectedAddBtn} onClick={()=> goShopping(item.link)}>
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

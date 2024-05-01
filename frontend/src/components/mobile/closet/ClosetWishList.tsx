import React,{ startTransition, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartItemList, cartItemDelete } from '@/api/apiCart'

const ClosetWishList: React.FC = () => {
  interface cartInfo {
    name: string,
    price: string,
    image?: string,
    link: string,
    closetPk: number
  }
  const[cartList, setCartList] = useState<cartInfo[]>([])
  const[isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()




  const goShopping = (link:string) => {
    startTransition(()=>{
      navigate(`/somewhere/${link}`)
    })
  }
  
  const profilePk = Number(localStorage.getItem('userPk'))
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
        setIsLoading(!isLoading)
      },100)
    })
  }

  return (
    <div>
      <img src="" alt="back" onClick={()=>
       startTransition(()=>{navigate('/mobile/closet')})} 
     />
          <h1>장바구니</h1>
          <hr />
          <h3>{isLoading? "장바구니 불러오는중...":""}</h3>
      {cartList.map((item, idx) => (
        <div key={idx}>
          <div>
            {item.image && <img src={item.image} alt='옷 사진'/>}
            <b>{item.name}</b> 
            <img src="" alt="delete-item" onClick={()=>deleteItem(item.closetPk)} />
            <br />
            {item.price} 원
            <button onClick={()=> goShopping(item.link)}>구매하러가기</button>
            <hr />
          </div>
        </div>
      ))}

    </div>
  )
}

export default ClosetWishList

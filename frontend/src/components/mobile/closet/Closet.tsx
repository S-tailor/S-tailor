import React,{ useEffect, startTransition, useState } from 'react'
import userStore from '@/store/store'
import { useNavigate } from 'react-router-dom'
import { closetItemList } from '@/api/apiCloset'
import { cartItemAdd } from '@/api/apiCart'


const Closet: React.FC = () => {
  interface clothInfo {
    name: string,
    price: string,
    image?: string,
    link: string,
    closetPk: number

  }
  const{user, clearUsers} = userStore()
  const [clothList, setClothList] = useState<clothInfo[]>([])
  const navigate = useNavigate()
  const userName= user[0]?.profileName  ?? 'Guest';
  const [isLoading, setIsLoading] = useState(true);


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


  const addCart = async(pk:number) => {
    await cartItemAdd(pk)
    .then(() => {
      alert('장바구니에 추가되었습니다!')
    })

  }

  return (
    <div>
      <header>
      <img src="" alt="back" onClick={()=>{clearUsers(),
        startTransition(()=>{
          navigate('/mobile/profile')})} 
        }
          />
      <h1>S-TAILOR</h1>
        <img src="" alt="search" onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/closet/search')})}}
        />
        <img src="" alt="cart" onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/closet/wishlist')})}} 
        />
      </header>

      <nav>

      </nav>

      <div>  
      <h2>{userName} 님의 옷장</h2>
      <br />
      <h3>{isLoading ? "옷장 문 여는중..." : ""}</h3>
      {clothList.map((cloth, idx) => (
        <div key={idx}>
          <p>
            {cloth.image && <img src={cloth.image} alt='옷 사진'/>}
            <br />
            <b>{cloth.name}</b>
            <br />
            {cloth.price} ￦
            <img src="" alt="cart에 담기" onClick={()=>{
              addCart(cloth.closetPk)
            }}/>
          </p>
        </div>
      ))}

      {/* {showLink && 
      <p onClick={()=>{navigate('/')}}>
        {link}
      </p>
      } */}
      <button onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/closet/code/input')
        })}}
        >옷 입어보기</button>
      </div>

      <footer>
        <img src="" alt="closet-home" onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/closet')})} 
        }
        />
        <img src="" alt="clothes-add" onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/add-cloth')})} 
        }
        />
        <img src="" alt="style-recomm" onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/ask')})} 
        }
        />
        <img src="" alt="myPage" onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/mypage')})} 
        }
        />
      </footer>
    </div>
  )
}

export default Closet

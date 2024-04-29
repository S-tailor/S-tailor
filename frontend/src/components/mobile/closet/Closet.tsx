import React from 'react'
import userStore from '@/store/store'
import { useNavigate } from 'react-router-dom'
import { startTransition } from 'react'

const Closet: React.FC = () => {
  const{user, setUser} = userStore()
  const navigate = useNavigate()
  const goSearch = () => {
    startTransition(() => {

      navigate('/mobile/add-cloth')
    })
  } 
  console.log(user)
  const userName = user.length > 0 ? user[0].profileName : 'Guest';
  return (
    <div>
      <h1>S-TAILOR</h1>
      
        <img src="" alt="search" onClick={goSearch}/>
      
      <h1>{userName} 님의 옷장</h1>
    </div>
  )
}

export default Closet

import React, {startTransition, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { profileList } from '@/api/apiProfile'


const Profile: React.FC = () => {
  const navigate = useNavigate()
  
  const goBack = () => {
    startTransition(() => {
    navigate('/')
    })
  }

  const userAdd = () => {
    startTransition(() => {
      navigate('add')
    })
  }
  let response
  useEffect(()=>{
    response = profileList()
  },[])
 

  return (
    <div>
      
      <img src="" alt="back" onClick={goBack} />

      <h1>프로필 선택</h1>
      <p>가상 피팅 서비스를 이용할 프로필을 선택하세요.</p>
      {response}
      <img src="" alt="user-add" onClick={userAdd}/>
    
    
    
    </div>
  )
}

export default Profile

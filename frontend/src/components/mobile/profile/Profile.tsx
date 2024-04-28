import React, {startTransition, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { profileList } from '@/api/apiProfile'


const Profile: React.FC = () => {
  const navigate = useNavigate()
  const [userList, setUserList] = useState([]);  // 상태로 userList를 관리



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
  useEffect(()=>{
    const id = String(localStorage.getItem('id'))
    fetchUser(id)  
  },[])

 
  const fetchUser = async (id:string) => {
    const response = await profileList(id)
    setUserList(response.data.result);
   
  }



  return (
    <div>
      
      <img src="" alt="back" onClick={goBack} />

      <h1>프로필 선택</h1>
      <p>가상 피팅 서비스를 이용할 프로필을 선택하세요.</p>

       {userList.map((user, index) => (
          <div key={index}>
            <p>
            {user.image && <img src={user.image} alt="Uploaded Profile" />}
              <br />
              {user.profileName}
            </p> 
          </div>
        ))}
 
    
      <img src="" alt="user-add" onClick={userAdd}/>
    
    
    
    </div>
  )
}

export default Profile

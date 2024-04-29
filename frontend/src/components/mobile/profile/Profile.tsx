import React, {startTransition, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { profileList, profileSelect } from '@/api/apiProfile'
import userStore from '@/store/store'

const Profile: React.FC = () => {
  interface UserProfile {
    profilePk: number;
    image?: string;
    profileName: string;
  }
  const [userList, setUserList] = useState<UserProfile[]>([]); 
  const navigate = useNavigate()
  const {setUser} = userStore()
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 유저 프로필 리스트 불러오기
  useEffect(()=>{
    const id = String(localStorage.getItem('id'))
      fetchUser(id)  
  },[])

 // 유저 프로필 리스트
  const fetchUser = async (id:string) => {
    const response = await profileList(id)
    setTimeout(() => {
      setUserList(response.data.result);
      setIsLoading(!isLoading);
    }, 100);
  }

  // 유저 프로필 클릭시 
  const userDetail = async (userPk:number) => {
    let response = await profileSelect(userPk)
    if (response.status === 200) {
     
      setUser(response.data.result)
      startTransition(() => {
        navigate('/mobile/closet')
      })
    }
  }



  return (
    <div>
      <img src="" alt="back" onClick={()=>
        startTransition(()=>{navigate('/')})} 
      />

      <h1>프로필 선택</h1>
      <p>가상 피팅 서비스를 이용할 프로필을 선택하세요.</p>
      <h3>{isLoading ? "프로필 로딩중..." : ""}</h3>
       {userList.map((user, index) => (
         <div key={index}>
            <p onClick={() => userDetail(user.profilePk)}>
            {user.image && <img src={user.image} alt="Uploaded Profile" />}
              <br />
              {user.profileName}
            </p> 
          </div>
        ))}
 
      <img src="" alt="user-add" 
      onClick={()=>{
      startTransition(()=>{navigate('/mobile/profile/add')})}}
        />
    </div>
  )
}

export default Profile

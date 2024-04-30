import React, { Suspense, startTransition, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileList, profileSelect } from '@/api/apiProfile'
import userStore from '@/store/store'

const Profile: React.FC = () => {
  interface UserProfile {
    profilePk: number
    image?: string
    profileName: string
  }
  const [userList, setUserList] = useState<UserProfile[]>([])
  const navigate = useNavigate()

  const { setUser, setProfilePk } = userStore()

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
  useEffect(() => {
    const id = String(localStorage.getItem('id'))
    fetchUser(id)
  }, [])

  const fetchUser = async (id: string) => {
    const response = await profileList(id)
    setUserList(response.data.result)
  }

  const userDetail = async (userPk: number) => {
    // console.log('유저번호', userPk)
    let response = await profileSelect(userPk)
    if (response.status === 200) {
      // console.log(response.data.result)
      setUser(response.data.result)
      setProfilePk(response.data.result.profilePk)
      startTransition(() => {
        navigate('/mobile/closet')
      })
    }
  }

  return (
    <div>
      <Suspense>
        <img src="" alt="back" onClick={goBack} />

        <h1>프로필 선택</h1>
        <p>가상 피팅 서비스를 이용할 프로필을 선택하세요.</p>

        {userList.map((user, index) => (
          <div key={index}>
            <p onClick={() => userDetail(user.profilePk)}>
              {user.image && <img src={user.image} alt="Uploaded Profile" />}
              <br />
              {user.profileName}
            </p>
          </div>
        ))}

        <img src="" alt="user-add" onClick={userAdd} />
      </Suspense>
    </div>
  )
}

export default Profile

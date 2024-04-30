import userStore from '@/store/store'
// import { all } from 'axios'
import React, { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'

const MyPage: React.FC = () => {
  const navigate = useNavigate()

  // 프로필 이름
  const user = userStore((state) => state.user)
  const profileName = user[0]?.profileName ?? 'Guest'
  // 프로필 사진
  const profileImg = user[0]?.image

  const ClosetSearchClick = () => {
    startTransition(() => {
      navigate('/mobile/closet/search')
    })
  }

  const ProfileChangeClick = () => {
    startTransition(() => {
      navigate('/mobile/profile')
    })
  }

  const LogoutClick = () => {
    startTransition(() => {
      // 로그아웃 전, accessToken의 존재 여부 확인
      // console.log('로그아웃 전 accessToken:', window.localStorage.getItem('accessToken'))

      // accessToken 삭제로 로그아웃
      window.localStorage.removeItem('accessToken')

      // 로그아웃 후, accessToken이 제거되었는지 확인
      console.log('로그아웃 후 accessToken:', window.localStorage.getItem('accessToken'))

      navigate('/mobile/start')
    })
  }

  return (
    <div>
      {/* 검색 아이콘으로 변경 필요 */}
      <button onClick={ClosetSearchClick}>옷장 검색</button>

      <button onClick={ProfileChangeClick}>프로필 변경</button>
      <button onClick={LogoutClick}>로그아웃</button>
      <div>
        <img src={profileImg} alt="프로필 이미지" />
        <h3>{profileName}</h3>
      </div>
      <h1>MyPage Component</h1>

      <div>
        <h3>2D 가상 피팅 결과 사진 확인</h3>
      </div>
    </div>
  )
}

export default MyPage

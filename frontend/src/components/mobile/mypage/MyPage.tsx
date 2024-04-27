import React, { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'

const MyPage: React.FC = () => {
  const navigate = useNavigate()

  const LogoutClick = () => {
    startTransition(() => {
      // 로그아웃 전, accessToken의 존재 여부 확인
      console.log('로그아웃 전 accessToken:', window.localStorage.getItem('accessToken'))

      window.localStorage.removeItem('accessToken')

      // 로그아웃 후, accessToken이 제거되었는지 확인
      console.log('로그아웃 후 accessToken:', window.localStorage.getItem('accessToken'))

      navigate('/mobile/start')
    })
  }

  return (
    <div>
      <button onClick={LogoutClick}>로그아웃</button>
      <h1>MyPage Component</h1>
    </div>
  )
}

export default MyPage

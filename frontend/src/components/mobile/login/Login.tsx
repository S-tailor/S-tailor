import React, { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const navigate = useNavigate()

  const LoginClick = () => {
    startTransition(() => {
      navigate('/mobile/profile')
    })
  }

  return (
    <div>
      <h1>Login Component</h1>
      <input type="password" placeholder="비밀번호를 입력하세요." />

      <button onClick={LoginClick}>로그인</button>
    </div>
  )
}

export default Login

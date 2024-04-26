import React, { startTransition, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userLogin } from '../../../api/apiUser'

const Login: React.FC = () => {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const id = location.state?.id

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const LoginClick = async () => {
    try {
      const response = await userLogin(id, password)
      console.log(response)
      if (response.data.message === 'Success') {
        startTransition(() => {
          navigate('/mobile/profile')
        })
      } else {
        alert('비밀번호가 틀렸습니다.')
      }
    } catch (error) {
      console.error('로그인 실패', error)
    }
  }

  return (
    <div>
      <h1>Login Component</h1>
      <input type="password" onChange={handlePasswordChange} placeholder="비밀번호를 입력하세요." />

      <button onClick={LoginClick}>로그인</button>
    </div>
  )
}

export default Login

import React, { startTransition, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userLogin } from '../../../api/apiUser'

const Login: React.FC = () => {
  const [password, setPassword] = useState<string>('')
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
      if (response.data.statusCode === 200) {
        console.log('로그인 성공', response.data)
        startTransition(() => {
          navigate('/mobile/profile')
        })
        // accessToken 저장
        window.localStorage.setItem('accessToken', response.data.accessToken)
        window.localStorage.setItem('userPk',response.data.userPk)
        window.localStorage.setItem('id', id)
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
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="비밀번호를 입력하세요."
      />

      <button onClick={LoginClick}>로그인</button>
    </div>
  )
}

export default Login

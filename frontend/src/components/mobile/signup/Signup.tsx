import React, { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { userCreate } from '@/api/apiUser'

const Signup: React.FC = () => {
  const navigate = useNavigate()

  const SignupClick = () => {
    startTransition(() => {
      navigate('/mobile/login')
    })
  }

  return (
    <div>
      <h1>Signup Component</h1>
      <input type="password" placeholder="비밀번호를 입력해주세요" />
      <input type="password" placeholder="다시 한 번 입력해주세요" />

      <button onClick={SignupClick}>회원가입</button>
    </div>
  )
}

export default Signup

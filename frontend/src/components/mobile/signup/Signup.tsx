import React, { startTransition, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userCreate } from '@/api/apiUser'

const Signup: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const id = location.state?.id
  if (!id) {
    console.error('No ID provided from Start page.')
    startTransition(() => {
      navigate('/mobile/start')
    })
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value)
  }

  const SignupClick = async () => {
    if (!password) {
      alert('비밀번호를 입력해주세요.')
      return
    } else if (!confirmPassword) {
      alert('비밀번호를 다시 한 번 입력해주세요.')
      return
    } else if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const response = await userCreate(id, password)
      // console.log(response)
      if (response.data.statusCode === 200) {
        const configData = JSON.parse(response.config.data)
        const signupId = configData.id
        startTransition(() => {
          navigate('/mobile/login', { state: { id: signupId } })
        })
      } else {
        alert('회원가입에 실패했습니다.')
      }
    } catch (error) {
      console.error('회원가입 실패', error)
    }
  }

  return (
    <div>
      <h1>Signup Component</h1>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="비밀번호를 입력해주세요."
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        placeholder="다시 한 번 입력해주세요."
      />

      <button onClick={SignupClick}>회원가입</button>
    </div>
  )
}

export default Signup

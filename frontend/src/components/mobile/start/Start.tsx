import React, { startTransition, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userCheck } from '../../../api/apiUser'

const Start: React.FC = () => {
  const [isUser, setIsUser] = useState('')

  const navigate = useNavigate()

  const checkEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUser(event.target.value)
  }

  const ContinueClick = async () => {
    try {
      // 이메일 존재 여부 확인
      const response = await userCheck(isUser)
      console.log(response)
      if (response.data.isUser == true) {
        // 이메일이 존재하면 로그인 화면으로 이동
        startTransition(() => {
          navigate('/mobile/login', { state: { id: response.config.params.id } })
        })
      } else {
        // 이메일이 존재하지 않으면 회원가입 화면으로 이동
        startTransition(() => {
          navigate('/mobile/signup', { state: { id: response.config.params.id } })
        })
      }
    } catch (error) {
      // 오류 발생 시 로그 출력
      console.error('DB 오류', error)
    }
  }
  return (
    <div>
      <h1>Start Component</h1>
      <input type="email" onChange={checkEmail} placeholder="이메일 주소를 입력하세요." />
      <button onClick={ContinueClick}>계속하기</button>
    </div>
  )
}

export default Start

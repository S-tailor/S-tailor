import React, { startTransition, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api/tryon'

const ClosetCodeInput: React.FC = () => {
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState('')
  useEffect(() => {
    sessionStorage.setItem('profilePk', 2)
    sessionStorage.setItem('id', 'test1')
    sessionStorage.setItem(
      'token',
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MSIsImlzcyI6InNzYWZ5LmNvbSIsImV4cCI6MTcxNTg3OTg5MywiaWF0IjoxNzE0NTgzODkzfQ.NT19ttDYOhbs0ejrdwooVLz4c2MsbC0_zqLqkJ4it_cqIp50TeMsnCUqxP9C75jlUtkq4scQxUHrz1PftIEv0A'
    )
  }, [])

  const handleVerify = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const params = {
      profilePk: sessionStorage.getItem('profilePk'),
      id: sessionStorage.getItem('id'),
      token: sessionStorage.getItem('token'),
      sessionId: sessionId
    }
    console.log(params)

    await axios
      .post(`${BASE_URL}/verify`, params)
      .then(function (response) {
        if (response.data == 'success') {
          //alert('로그인 성공!')
          navigate('/mobile/closet/tryon/wait')
        }
        console.log('handleVerify', response)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }
  return (
    <div>
      <img
        src=""
        alt="back"
        onClick={() =>
          startTransition(() => {
            navigate('/mobile/closet')
          })
        }
      />
      <header>
        <h3>옷 입어보기</h3>
      </header>

      <h1>인증코드 입력</h1>
      <p>기기에 표시된 6자리 번호를 입력해주세요.</p>

      <form onSubmit={handleVerify}>
        <input
          type="text"
          value={sessionId}
          onChange={(event) => {
            setSessionId(event.target.value)
          }}
        ></input>
        <button type="submit">sessionId 보내기</button>
      </form>

      <button
        onClick={() => {
          startTransition(() => {
            navigate('/mobile/closet/tryon/wait')
          })
        }}
      >
        완료
      </button>
    </div>
  )
}

export default ClosetCodeInput

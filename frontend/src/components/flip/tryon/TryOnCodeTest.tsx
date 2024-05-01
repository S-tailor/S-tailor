import React from 'react'
import { useState } from 'react'

const BASE_URL = 'http://localhost:5000'
const TIME = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60
}

const TryOn: React.FC = () => {
  const [sessionId, setSessionId] = useState('')
  const [token, setToken] = useState('')
  const [remainTime, setRemainTime] = useState(TIME.ONE_MINUTE)
  const startTimer = () => {
    setInterval(() => {
      setRemainTime((remainTime) => remainTime - 1)
    }, TIME.ONE_SECOND)
  }
  const resetTimer = () => setRemainTime(TIME.ONE_MINUTE)

  const handleConnect = () => {
    const sse = new EventSource(`${BASE_URL}/api/tryon/connect`)

    sse.addEventListener('connect', (e) => {
      const { data: receivedConnectData } = e

      console.log('connect event data: ', receivedConnectData)
      setSessionId(receivedConnectData)
      resetTimer()
      startTimer()
    })

    sse.addEventListener('getToken', (e) => {
      const { data: receivedToken } = e
      setToken(receivedToken)
      sessionStorage.setItem('token', receivedToken)
      console.log('token event data', receivedToken)
    })
  }

  return (
    <div>
      <h1>Flip</h1>
      <button onClick={handleConnect}>connect 요청</button>
      <div>SessionId : {sessionId}</div>
      <div>{remainTime}</div>
      <div style={{ width: '400px', wordWrap: 'break-word' }}>TOKEN : {token}</div>
    </div>
  )
}

export default TryOn

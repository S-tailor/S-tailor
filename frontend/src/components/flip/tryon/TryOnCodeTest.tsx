import React from 'react'
import { useState } from 'react'

const BASE_URL = 'http://localhost:5000'
const TIME = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60
}

const TryOn: React.FC = () => {
  const [sessionId, setSessionId] = useState('')
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
  }

  return (
    <div>
      <button onClick={handleConnect}>connect 요청</button>
      <div>{sessionId}</div>
      <div>{remainTime}</div>
    </div>
  )
}

export default TryOn

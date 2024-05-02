import React, { startTransition, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = 'http://localhost:5000'
const TIME = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60
}

const TryOn: React.FC = () => {
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState('')
  const [token, setToken] = useState('')
  const [remainTime, setRemainTime] = useState(TIME.ONE_MINUTE)

  const useInterval = (callback: () => void, delay: number) => {
    const savedCallback = useRef(callback)
    useEffect(() => {
      savedCallback.current = callback
    }, [callback])

    useEffect(() => {
      function tick() {
        savedCallback.current()
      }
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }, [])
  }

  useInterval(() => {
    remainTime > 0 && sessionId && setRemainTime(remainTime - 1)
  }, TIME.ONE_SECOND)
  const resetTimer = () => setRemainTime(TIME.ONE_MINUTE)

  const handleConnect = () => {
    const sse = new EventSource(`${BASE_URL}/api/tryon/connect`)

    sse.addEventListener('connect', (e) => {
      const { data: receivedConnectData } = e
      console.log('connect event data: ', receivedConnectData)
      setSessionId(receivedConnectData)
      resetTimer()
    })

    sse.addEventListener('getUserInfo', (e) => {
      const { data: receivedUserInfo } = e
      setToken(receivedUserInfo)
      sessionStorage.setItem('token', receivedUserInfo)
      console.log('token event data', receivedUserInfo)

      console.log('json', JSON.parse(receivedUserInfo))

      if (receivedUserInfo != '') {
        sse.close()
        navigate('/flip/tryon')
      }
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

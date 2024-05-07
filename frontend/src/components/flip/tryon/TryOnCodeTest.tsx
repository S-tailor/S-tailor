import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode.react'
// const BASE_URL = 'http://localhost:5000'
const BASE_URL = 'https://ourtrip.store'
const TIME = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60  
}

const TryOn: React.FC = () => {
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState('')
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
    remainTime > 0 && setRemainTime(remainTime - 1)
  }, TIME.ONE_SECOND)
  const resetTimer = () => setRemainTime(TIME.ONE_MINUTE)

  const handleConnect = () => {
    

      const sse = new EventSource(`${BASE_URL}/api/tryon/connect`)
      
      sse.addEventListener('connect', (e) => {
        const { data: receivedConnectData } = e
        setSessionId(receivedConnectData)
        resetTimer()
        
      })
      
      sse.addEventListener('getUserInfo', (e) => {
        const { data: receivedUserInfo } = e
        
        
        if (receivedUserInfo != '') {
          sse.close()
          navigate('/flip/tryon')
        }})
  }

  return (
    <div>
      <h3>가상 피팅</h3>
      <br />
      <p>1. 스마트폰으로 오른쪽 QR코드를 스캔해 S-Tailor 앱을 여십시오. </p>
      <p>2. 로그인 후 '옷 입어보기'를 선택하십시오.</p>
      <p>3. 아래 버튼을 눌러 QR코드를 띄우십시오.</p>
      <button onClick={handleConnect}>QR코드 보기</button>
      <hr />
      <section>
      {sessionId && remainTime > 0 ?
        <>
        <QRCode value={sessionId}/>
        <h3>{remainTime}초 남았습니다.</h3>
        </> : 
        <div style={{width:'128px', height:'128px', backgroundColor:'gray'}}>
        <p>제한시간 내 다시 시도해주세요.</p>
        <small>* QR코드 보기 버튼을 눌러주세요.</small>
      </div>
        }
        </section>
         <p>* QR코드가 나타난 후 1분 이내 인증을 완료해주세요.</p>
    
  
    </div>
  )
}

export default TryOn

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode.react'
import styles from '../../../scss/tryoncodetest.module.scss'

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
    <div className={styles.container}>

      <div className={styles.bgVideo}>
        <video className={styles.bgVideoContent} autoPlay muted loop>
          <source src="/assets/background.mp4" />
        </video>
      </div>

      <section className={styles.topTitle}>
        <p className={styles.topText}>가상 피팅</p>
        <p className={styles.subText1}>1.&nbsp; 스마트폰으로 아래 QR코드를 스캔해 S-Tailor 앱을 여십시오.</p>
        <p className={styles.subText2}>2.&nbsp; 로그인 후 '옷 입어보기'를 선택하십시오.</p>
        <p className={styles.subText3}>3.&nbsp; 아래 버튼을 눌러 QR코드를 띄우십시오.</p>
      </section>

      <section className={styles.middleBtn}>
        <button className={styles.btn} onClick={handleConnect}>QR코드 보기</button>
      </section>
      
      <section className={styles.bottomText}>
         <p className={styles.bottomTextInner}>* QR코드가 나타난 후 1분 이내 인증을 완료해주세요. *</p>
      </section>

      <section className={styles.qrcode}>
        {sessionId && remainTime > 0 ?
          <>
            <QRCode className={styles.qrcodeImg} value={sessionId}/>
            <p className={styles.remainTime}>{remainTime}초 남았습니다.</p>
          </> : 
          <div className={styles.qrcodeInner}>
            <p className={styles.qrcodeInnerText1}>QR코드 보기 버튼을 다시 눌러주세요.</p>
          </div>
          }
      </section>
  
    </div>
  )
}

export default TryOn

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode.react'
import styles from '../../../scss/tryoncodetest.module.scss'

// const BASE_URL = 'http://localhost:5000'
const BASE_URL = 'https://ourtrip.store'

const TryOn: React.FC = () => {
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState('')

  const handleConnect = () => {
    const sse = new EventSource(`${BASE_URL}/api/tryon/connect`)

    sse.addEventListener('connect', (e) => {
      const { data: receivedConnectData } = e
      setSessionId(receivedConnectData)
    })

    sse.addEventListener('getUserInfo', (e) => {
      const { data: receivedUserInfo } = e

      if (receivedUserInfo != '') {
        sse.close()
        navigate('/flip/tryon')
      }
    })
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
        <p className={styles.subText1}>
          1.&nbsp; 스마트폰으로 아래 QR코드를 스캔해 S-Tailor 앱을 여십시오.
        </p>
        <p className={styles.subText2}>2.&nbsp; 로그인 후 '옷 입어보기'를 선택하십시오.</p>
        <p className={styles.subText3}>3.&nbsp; 아래 버튼을 눌러 QR코드를 띄우십시오.</p>
      </section>

      <section className={styles.middleBtn}>
        <button className={styles.btn} onClick={handleConnect}>
          QR코드 보기
        </button>
      </section>

      <section className={styles.bottomText}>
        <p className={styles.bottomTextInner}>QR코드가 나타난 후 1분 이내 인증을 완료해주세요.</p>
      </section>

      <section className={styles.qrcode}>
        {sessionId ? (
          <div className={styles.qrcodeCreate}>
            <QRCode className={styles.qrcodeImg} value={sessionId} />
          </div>
        ) : (
          <div className={styles.qrcodeInner}>
            <p className={styles.qrcodeInnerText1}>'QR코드 보기' 버튼을 눌러주세요.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default TryOn

import React, { startTransition, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { QrReader } from 'react-qr-reader'
import styles from '../../../scss/closetcodeinputtest.module.scss'

const BASE_URL = 'https://ourtrip.store/api/tryon'
// const BASE_URL = 'http://localhost:5000/api/tryon'

const ClosetCodeInput: React.FC = () => {
  const [camera, setCamera] = useState(true)
  const navigate = useNavigate()
  const [data, setData] = useState('')
  const [message, setMessage] = useState('코드 인식이 완료되었습니다. 확인버튼을 눌러주세요.')

  const handleVerify = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (data) {
      const result = data.replace(/"/g, '')

      const params = {
        profilePk: sessionStorage.getItem('profilePk'),
        id: localStorage.getItem('id'),
        token: localStorage.getItem('accessToken'),
        sessionId: result
      }

      await axios
        .post(`${BASE_URL}/verify`, params)
        .then(function (response) {
          if (response.data == 'success') {
            setCamera(false)
            navigate('/mobile/closet/tryon/wait')
          }
        })
        .catch(function (error) {
          setMessage('다시 시도해주세요.')
          console.log('error', error)
        })
    }
    setMessage('')
  }

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <div className={styles.headerInner}>
            <div className={styles.headerInner1}>
            <img 
              onClick={() =>
              startTransition(() => {
                navigate('/mobile/closet')
              })
              }
              className={styles.backBtn} 
              src="/assets/backBtn.svg" 
              alt="backBtn"
            />
            </div>
        
            <div className={styles.headerInner2}>
              <p className={styles.title}>옷 입어보기</p>
            </div>
            <div className={styles.headerInner3}>
            </div>
        </div>
      </div>

      <div className={styles.topTitle}>
        <p className={styles.mainTitle}>QR코드 인증</p>
        <p className={styles.subTitle}>기기에 표시된 QR코드를 촬영해주세요.</p>
      </div>


        {camera && (
          <QrReader
            className={styles.qrreder}
            constraints={{ facingMode: 'environment' }}
            onResult={(result: any | null, error) => {
              if (result) {
                setData(result.text)
              }
              if (error) {
                console.info(error)
              }
            }}
            videoStyle={{ width: '100%', height: '40vh', objectFit: 'cover' }}
          />
        )}

      <section className={styles.bottomButton}>
        {data && 
          <>
            <div className={styles.infoText}>{message}</div>
            <button className={styles.btn} onClick={handleVerify}>확인</button>
          </>
        }
        </section>

    </div>
  )
}

export default ClosetCodeInput

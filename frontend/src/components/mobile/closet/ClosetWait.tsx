import React from 'react'
import { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../../scss/closetwait.module.scss';

const ClosetWait: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.container}>
      <div className={styles.bgVideo}>
        <video className={styles.bgVideoContent} autoPlay muted loop>
          <source src='/assets/background.mp4' />
        </video>
      </div>
      <section className={styles.topTitle}>
        <div className={styles.topTitleInner}>
          <p className={styles.texts}>FASHION IS</p>
          <p className={styles.texts}>INSTANT</p>
          <p className={styles.texts}>LANGUAGE</p>
        </div>
      </section>

      <section className={styles.connectContent}>
        <img className={styles.connetImg} src="/assets/connectimage.png" alt="connectImg" />
        <p className={styles.connetText}>연결이 완료되었습니다!</p>
        <p className={styles.connetText}>기기화면을 통해 가상피팅서비스를 즐겨주세요 :)</p>
      </section>

      <section className={styles.middleTitle}>
        <div className={styles.middleTitleInner}>
          <p className={styles.texts}>S-TAILOR</p>
        </div>
      </section>
      <section className={styles.bottomButton}>
        <button 
          className={styles.btn} 
          onClick={()=>{startTransition(()=>{
            navigate('/mobile/closet')
          })}}
        >
          옷장으로 돌아가기  
        </button>
      </section>
    </div>
  )
}

export default ClosetWait

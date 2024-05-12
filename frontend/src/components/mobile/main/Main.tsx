import React, { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../../scss/main.module.scss'

const Main: React.FC = () => {
  const navigate = useNavigate()

  const StartClick = () => {
    startTransition(() => {
      navigate('/mobile/start')
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
        <div className={styles.topTitleInner}>
          <p className={styles.texts1}>FASHION IS</p>
          <p className={styles.texts1}>INSTANT</p>
          <p className={styles.texts1}>LANGUAGE</p>
        </div>
      </section>
      <section className={styles.middleTitle}>
        <div className={styles.middleTitleInner}>
          <p className={styles.texts2}>S-TAILOR</p>
        </div>
      </section>
      <section className={styles.bottomButton}>
        <button className={styles.btn} onClick={StartClick}>
          <span className={styles.btnText}></span>
        </button>
      </section>
    </div>
  )
}

export default Main

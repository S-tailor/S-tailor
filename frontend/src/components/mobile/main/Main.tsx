import React, { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../../scss/main.module.scss';

const Main: React.FC = () => {
  const navigate = useNavigate()

  const StartClick = () => {
    startTransition(() => {
      navigate('/mobile/start')
    })
  }

  return (
    <div className={styles.container}>
      <section className={styles.topTitle}>
        <div className={styles.topTitleInner}>
          <p className={styles.texts}>FASHION IS</p>
          <p className={styles.texts}>INSTANT</p>
          <p className={styles.texts}>LANGUAGE</p>
        </div>
      </section>
      <section className={styles.middleTitle}>
        <div className={styles.middleTitleInner}>
          <p className={styles.texts}>S-TAILOR</p>
        </div>
      </section>
      <section className={styles.bottomButton}>
        <button className={styles.btn} onClick={StartClick}>시작하기</button>
      </section>
    </div>
  )
}

export default Main;

import React, { useState, startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../../scss/flipmain.module.scss'

const FlipMain: React.FC = () => {
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const function1 = (event: any) => {
    if (event) setMessage('Welcome! 이제 S-Tailor와 함께할 시간!')
    setTimeout(() => {
      startTransition(() => {
        navigate('/flip/tryon/test')
      })
    }, 3000)
  }
  return (
    <div className={styles.container} onClick={function1}>
      <div className={styles.bgVideo}>
        <video className={styles.bgVideoContent} autoPlay muted loop>
          <source src="/assets/background.mp4" />
        </video>
      </div>
      <section className={styles.topTitle}>
        <div className={styles.topTitleInner}>
          <p className={styles.texts}>FASHION IS</p>
          <p className={styles.texts}>INSTANT</p>
          <p className={styles.texts}>LANGUAGE</p>
        </div>
      </section>
      <section className={styles.touch}>
        {!message ? 
        <img className={styles.touchImg} src='/assets/touch.svg'/>
         : 
         <p className={styles.touchText}>{message}</p>}
      </section>
      <section className={styles.middleTitle}>
        <div className={styles.middleTitleInner}>
          <p className={styles.texts}>S-TAILOR</p>
        </div>
      </section>
    </div>
  )
}

export default FlipMain

import React, { startTransition, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userCheck } from '../../../api/apiUser'
import styles from '../../../scss/start.module.scss';

const Start: React.FC = () => {
  const [isUser, setIsUser] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const checkEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUser(event.target.value)
  }

  const ContinueClick = async () => {
    setIsLoading(true)
    try {
      // 이메일 존재 여부 확인
      const response = await userCheck(isUser)
      if (response.data.isUser == true) {
        // 이메일이 존재하면 로그인 화면으로 이동
        startTransition(() => {
          navigate('/mobile/login', { state: { id: response.config.params.id } })
        })
      } else {
        // 이메일이 존재하지 않으면 회원가입 화면으로 이동
        startTransition(() => {
          navigate('/mobile/signup', { state: { id: response.config.params.id } })
        })
      }
    } catch (error) {
      // 오류 발생 시 로그 출력
      console.error('DB 오류', error)
    }
    setIsLoading(true)
  }

  const goHome = () => {
    startTransition(() => {
      navigate('/')
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.bgVideo}>
        <video className={styles.bgVideoContent} autoPlay muted loop>
          <source src='/assets/background_light.mp4' />
        </video>
			</div>

      <div className={styles.header}>
        <div className={styles.headerInner}>
          <img onClick={goHome} className={styles.closeBtn} src="/assets/closeBtn.svg" alt="closeBtn" />
        </div>
      </div>

      <section className={styles.topInfo}>
        <p className={styles.texts}>가상 옷장을</p>
        <p className={styles.texts}>만들어 볼까요?</p>
      </section>

      <section className={styles.middleInput}>
        <div className={styles.labels}>
          <p className={styles.subtexts}>먼저 로그인이 필요해요 :)</p>
        </div>
        <div className={styles.textfield}>
          <input className={styles.emailInput} type="email" onChange={checkEmail} placeholder="이메일 주소를 입력해주세요." autoFocus />
          <p className={styles.line}></p>
        </div>
      </section>

      <section className={styles.bottomButton}>
        <button className={styles.btn} onClick={ContinueClick}>
        {isLoading ? (
                  <img className={styles.loading} src="/assets/loading.gif" alt="로딩 중" />
                ) : (
                  "계속하기"
                )}
        </button>
      </section>

    </div>
  )
}

export default Start

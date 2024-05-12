import React, { startTransition, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userCreate } from '@/api/apiUser'
import styles from '../../../scss/signup.module.scss'

const Signup: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const id = location.state?.id
  if (!id) {
    console.error('No ID provided from Start page.')
    startTransition(() => {
      navigate('/mobile/start')
    })
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value)
  }

  const SignupClick = async () => {
    if (!password) {
      alert('비밀번호를 입력해주세요.')
      return
    } else if (!confirmPassword) {
      alert('비밀번호를 다시 한 번 입력해주세요.')
      return
    } else if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    
    try {
      setIsLoading(true)
      const response = await userCreate(id, password)
      if (response.data.statusCode === 200) {
        const configData = JSON.parse(response.config.data)
        const signupId = configData.id
        startTransition(() => {
          navigate('/mobile/login', { state: { id: signupId } })
        })
      } else {
        alert('회원가입에 실패했습니다.')
      }
    } catch (error) {
      console.error('회원가입 실패', error)
    }

    setIsLoading(false)
  }

  const goEmail = () => {
    startTransition(() => {
      navigate('/mobile/start')
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.bgVideo}>
        <video className={styles.bgVideoContent} autoPlay muted loop >
          <source src='/assets/background_light.mp4' />
        </video>
			</div>

      <div className={styles.header}>
        <div className={styles.headerInner1}>
          <img
            onClick={goEmail}
            className={styles.backBtn}
            src="/assets/backBtn.svg"
            alt="backBtn"
          />
        </div>
        <div className={styles.headerInner2}>
          <p className={styles.signup}>회원가입</p>
        </div>
        <div className={styles.headerInner3}></div>
      </div>

      <article className={styles.topArticle}>
        <section className={styles.firstInfo}>
          <p className={styles.title1}>비밀번호 입력</p>
          <input
            className={styles.passwordInput}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력해주세요."
            autoFocus
          />
          <p className={styles.line}></p>
        </section>

        <section className={styles.secondInfo}>
          <p className={`${styles.title2} ${password.length >= 4 ? styles.active : ''}`}>
            비밀번호 확인
          </p>
          <input
            className={styles.passwordInput}
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="다시 한 번 입력해주세요."
          />
          <p className={`${styles.line2} ${password.length >= 4 ? styles.animate : ''}`}></p>
        </section>
      </article>

      <article className={styles.bottomArticle}>
        <section className={styles.privacyPolicy}>
          <p className={styles.privacy}>
            회원가입 시 S-Tailor의 <u>개인정보 보호정책</u>에 동의하게 됩니다.
          </p>
        </section>
        <section className={styles.bottomButton}>
          <button className={styles.btn} onClick={SignupClick}>
          {isLoading ? (
                  <img className={styles.loading} src="/assets/loading.gif" alt="로딩 중" />
                ) : (
                  "회원가입"
                )}
          </button>
        </section>
      </article>
    </div>
  )
}

export default Signup

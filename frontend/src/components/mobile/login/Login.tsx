import React, { startTransition, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userLogin } from '../../../api/apiUser'
import styles from '../../../scss/login.module.scss'

const Login: React.FC = () => {
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const id = location.state?.id

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const LoginClick = async () => {
    setIsLoading(true)
    try {
      const response = await userLogin(id, password)
      if (response.data.statusCode === 200) {
        const phase = localStorage.getItem('phase')
        window.localStorage.setItem('accessToken', response.data.accessToken)
        window.localStorage.setItem('userPk', response.data.userPk)
        window.localStorage.setItem('id', id)
        if (phase ===  '2') {
          startTransition(()=>{
            navigate('/mobile/closet/code/input')
          })
        }
        else {
        startTransition(() => {
          navigate('/mobile/profile')
        })
        // accessToken 저장
      }
      } else {
        alert('비밀번호가 틀렸습니다.')
      }
    } catch (error) {
      console.error('로그인 실패', error)
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
          <p className={styles.login}>로그인</p>
        </div>
        <div className={styles.headerInner3}></div>
      </div>

      <article className={styles.topArticle}>
        <section className={styles.firstInfo}>
          <p className={styles.title1}>비밀번호 입력</p>
          <p className={styles.subtexts}>반갑습니다 고객님!</p>
          <input
            className={styles.passwordInput}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력하세요."
            
          />
          <p className={styles.line}></p>
          <br />
          <br />

          <label className={styles.checkboxLabel}>
            <input
              className="checkInput"
              type="checkbox"
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            <span className={styles.checkboxIcon}></span>
            비밀번호 보기
          </label>
        </section>
      </article>

      <article className={styles.bottomArticle}>
        <section className={styles.bottomButton}>
          <button className={styles.btn} onClick={LoginClick}>
          {isLoading ? (
                  <img className={styles.loading} src="/assets/loading.gif" alt="로딩 중" />
                ) : (
                  "로그인"
                )}
          </button>
        </section>
      </article>
    </div>
  )
}

export default Login

import React, { startTransition, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userCreate } from '@/api/apiUser'
import styles from '../../../scss/signup.module.scss'
import Modal from './Modal'

const Signup: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const id = location.state?.id

  if (!id) {
    console.error('No ID provided from Start page.')
    startTransition(() => {
      navigate('/mobile/start')
    })
  }

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value)
  }

  const handlePrivacyCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreedToPrivacy(event.target.checked)
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
    } else if (!agreedToPrivacy) {
      alert('개인정보 수집·이용에 동의해주세요.')
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
          
          <label className={styles.checkboxLabel}>
            <input
              className="checkInput"
              type="checkbox"
              checked={agreedToPrivacy}
              onChange={handlePrivacyCheck}
            />
            <span className={styles.checkboxIcon}></span>
          </label>
            
          <label className={styles.privacy}>
            S-Tailor의 <u onClick={toggleModal}> 개인정보 수집·이용</u>에 동의합니다.(필수)
          </label>
        </section>

        {showModal && (
          <Modal closeModal={toggleModal}>
            <h2>개인정보 수집·이용 동의</h2>
              <p className={styles.privacyMainText}>S-Tailor 는 S-Tailor 서비스 회원가입, 고객상담 및 AS, 고지사항 전달 등을 위해 아래와 같이 개인정보를 수집·이용합니다.</p>
              <table className={styles.table}>
                <tr>
                  <th>수집 목적</th>
                  <th>수집 항목</th>
                  <th>수집 근거</th>
                </tr>
                <tr>
                  <td>회원 식별 및 회원제 서비스 제공</td>
                  <td>별명, 이메일, 비밀번호</td>
                  <td rowSpan={2}>개인정보 보호법 제15조 제1항</td>
                </tr>
                <tr>
                  <td>고객 맞춤화 서비스 제공</td>
                  <td>키, 체중, 성별</td>
                </tr>
              </table>
            <p className={styles.privacySubText}>귀하는 S-Tailor의 서비스 이용에 필요한 최소한의 개인정보 수집, 이용에 동의하지 않을 수 있으나, 동의를 거부 할 경우 회원제 서비스 이용이 불가합니다.</p>
          </Modal>
        )}

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

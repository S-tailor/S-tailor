import React, { startTransition, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userCheck } from '../../../api/apiUser'
import styles from '../../../scss/start.module.scss';

const Start: React.FC = () => {
  const [isUser, setIsUser] = useState('')

  const navigate = useNavigate()

  const checkEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUser(event.target.value)
  }

  const ContinueClick = async () => {
    try {
      // 이메일 존재 여부 확인
      const response = await userCheck(isUser)
      console.log(response)
      if (response.data.isUser == true) {
        // 이메일이 존재하면 로그인 화면으로 이동
        startTransition(() => {
          navigate('/mobile/login', { state: { id: response.config.params.id } })
        })
      } else {
        // 이메일이 존재하지 않으면 회원가입 화면으로 이동
        startTransition(() => {
          navigate('/mobile/signup')
        })
      }
    } catch (error) {
      // 오류 발생 시 로그 출력
      console.error('DB 오류', error)
    }
  }
  return (
    <div className={styles.container}>

      <header>
        <div className={styles.headerInner}>
          <Link to={'/'}>
            <img className={styles.closeBtn} src="/src/assets/closeBtn.svg" alt="closeBtn" />
          </Link>
        </div>
      </header>

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
        <button className={styles.btn} onClick={ContinueClick}>계속하기</button>
      </section>

    </div>
  )
}

export default Start

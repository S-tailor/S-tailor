import React, { startTransition, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileCreate } from '@/api/apiProfile'
import userStore from '@/store/store'
import styles from '../../../scss/profileadd.module.scss'

const ProfileAdd: React.FC = () => {
  const [page1, setPage1] = useState(true)
  const [page2, setPage2] = useState(false)
  const [page3, setPage3] = useState(false)
  const [page4, setPage4] = useState(false)
  const [message, setmessage] = useState('')
  const [file, setFile] = useState<File>()
  const [name, setName] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [fileUrl, setFileUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = userStore()
  interface userProfile {
    profileName: string
    profilePk: number
    image: string
  }
  const formData = new FormData()
  const navigate = useNavigate()

  // 입력단계바꾸기
  const toGender = () => {
    if (name.trim() !== '') {
      setmessage('')
      setPage1(false)
      setPage2(true)
    } else {
      setmessage('입력을 완료해주세요')
    }
  }

  const toHeight = () => {
    if (gender !== '') {
      setmessage('')
      setPage2(false)
      setPage3(true)
    } else {
      setmessage('입력을 완료해주세요')
    }
  }

  const toWeight = () => {
    if (height !== '') {
      setmessage('')
      setPage3(false)
      setPage4(true)
    } else {
      setmessage('입력을 완료해주세요')
    }
  }

  const complete = async () => {
    console.log('생성중')
    setIsSubmitting(true)
    const userPk = String(localStorage.getItem('userPk'))
    if (weight !== '') {
      formData.append('name', name)
      formData.append('height', height)
      formData.append('weight', weight)
      formData.append('gender', gender)
      if (file) {
        formData.append('image', file)
      } else {
        console.error('No file to append')
      }
      formData.append('userPk', userPk)
      setmessage('')

      const response = await profileCreate(formData)

      if (response.status == 200) {
        const userName = formData.get('name')
        const profilePk = Number(userPk);
        if (typeof userName === 'string' && !isNaN(profilePk)) {
          const userProfileData: userProfile = {
            profileName: userName,
            profilePk: profilePk,
            image: fileUrl
          };
          setUser(userProfileData)
          setIsSubmitting(false)
          startTransition(() => {
            navigate('/mobile/closet')
          })
        }
      }
    } else {
      setIsSubmitting(false)
      setmessage('입력을 완료해주세요')
    }
  }

  // 뒤로가기
  const goSelect = () => {
    startTransition(() => {
      navigate('/mobile/profile')
    })
  }

  const goName = () => {
    setPage2(false)
    setPage1(true)
  }

  const goGender = () => {
    setPage3(false)
    setPage2(true)
  }

  const goHeight = () => {
    setPage4(false)
    setPage3(true)
  }

  const changePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile)
      setFileUrl(fileUrl)
      setFile(selectedFile)
    } else {
      console.error('No file selected')
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleGenderChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const selectedGender = e.currentTarget.innerText
    startTransition(() => {
      setGender(selectedGender)
    })
  }

  const handleGenderBlur: React.FocusEventHandler<HTMLButtonElement> = (e) => {
    if (!e.relatedTarget) {
      setGender('')
    }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputHeight = e.target.value
    const numericHeight = parseInt(inputHeight, 10)
    if (!isNaN(numericHeight)) {
      setHeight(String(numericHeight))
    } else {
      setHeight('')
    }
  }

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputWeight = e.target.value
    const numericWeight = parseInt(inputWeight, 10)
    if (!isNaN(numericWeight)) {
      setWeight(String(numericWeight))
    } else {
      setWeight('')
    }
  }

  return (
    <>
      <div className={styles.container}>
      <div className={styles.bgVideo}>
        <video className={styles.bgVideoContent} autoPlay muted loop>
          <source src='/src/assets/background_light.mp4' />
        </video>
			</div>
        
        {page1 && (
          <>
            <div className={styles.header}>
              <div className={styles.headerInner1}>
                <img
                  onClick={goSelect}
                  className={styles.backBtn}
                  src="/src/assets/backBtn.svg"
                  alt="backBtn"
                />
              </div>
              <div className={styles.headerInner2}>
                <p className={styles.profileadd}>프로필 추가</p>
              </div>
              <div className={styles.headerInner3}></div>
            </div>

            <section className={styles.create}>
              <div className={styles.profileImg}>
                {file ? (
                  <img className={styles.uploadedImg} src={fileUrl} alt="Uploaded Profile" />
                ) : (
                  <img
                    className={styles.uploadedImg}
                    src="/src/assets/avatar.png"
                    alt="Uploaded Profile"
                  />
                )}
                <label htmlFor="exfile">
                  <img className={styles.labelImg} src="/src/assets/edit.svg" alt="edit" />
                  <input id="exfile" type="file" onChange={changePic}></input>
                </label>
              </div>
              <input
                className={styles.profileNameInput}
                type="text"
                placeholder="프로필 이름을 입력해주세요."
                value={name}
                onChange={handleNameChange}
                autoFocus
              />
              <p className={styles.line}></p>
              <br />
              <p className={`${styles.message} ${message ? styles.showMessage : ''}`}>{message}</p>
            </section>

            <section className={styles.bottomButton}>
              <button className={styles.btn} onClick={toGender}>
                다음
              </button>
            </section>
          </>
        )}

        {page2 && (
          <>
            <div className={styles.header}>
              <div className={styles.headerInner1}>
                <img
                  className={styles.backBtn}
                  src="/src/assets/backBtn.svg"
                  alt="backBtn"
                  onClick={goName}
                />
              </div>
              <div className={styles.headerInner2}>
                <p className={styles.profileadd}>프로필 추가</p>
              </div>
              <div className={styles.headerInner3}></div>
            </div>

            <section className={styles.create2}>
              <div className={styles.topInfo}>
                <p className={styles.texts}>성별 선택</p>
              </div>

              <div className={styles.toggleSwitch}>
                <button
                  className={styles.toggleButton}
                  onClick={handleGenderChange}
                  onBlur={handleGenderBlur}
                >
                  남성
                </button>
                <button
                  className={styles.toggleButton}
                  onClick={handleGenderChange}
                  onBlur={handleGenderBlur}
                >
                  여성
                </button>
              </div>
              <br />
              <p className={`${styles.message} ${message ? styles.showMessage : ''}`}>{message}</p>
            </section>

            <section className={styles.empty}></section>

            <section className={styles.bottomButton2}>
              <button className={styles.btn2} onClick={toHeight}>
                다음
              </button>
            </section>
          </>
        )}

        {page3 && (
          <>
            <div className={styles.header}>
              <div className={styles.headerInner1}>
                <img
                  className={styles.backBtn}
                  src="/src/assets/backBtn.svg"
                  alt="backBtn"
                  onClick={goGender}
                />
              </div>
              <div className={styles.headerInner2}>
                <p className={styles.profileadd}>프로필 추가</p>
              </div>
              <div className={styles.headerInner3}></div>
            </div>

            <section className={styles.create3}>
              <div className={styles.topInfo}>
                <p className={styles.texts}>키 입력</p>
                <p className={styles.subtexts}>가상 피팅 시 맞춤 사이즈 추천에 필요해요!</p>
              </div>

              <div className={styles.middleInfo}>
                <input
                  className={styles.profileNameInput2}
                  type="text"
                  placeholder="키를 입력해주세요."
                  value={height}
                  onChange={handleHeightChange}
                  autoFocus
                />
                <label className={styles.cm} htmlFor="">
                  cm
                </label>
                <p className={styles.line2}></p>
              </div>
            </section>

            <section className={styles.bottomButton3}>
              <p className={styles.subtexts2}>다음이 마지막 단계입니다!</p>
              <p className={`${styles.message} ${message ? styles.showMessage : ''}`}>{message}</p>
              <button className={styles.btn3} onClick={toWeight}>
                다음
              </button>
            </section>
          </>
        )}

        {page4 && (
          <>
            <div className={styles.header}>
              <div className={styles.headerInner1}>
                <img
                  className={styles.backBtn}
                  src="/src/assets/backBtn.svg"
                  alt="backBtn"
                  onClick={goHeight}
                />
              </div>
              <div className={styles.headerInner2}>
                <p className={styles.profileadd}>프로필 추가</p>
              </div>
              <div className={styles.headerInner3}></div>
            </div>

            <section className={styles.create3}>
              <div className={styles.topInfo}>
                <p className={styles.texts}>몸무게 입력</p>
                <p className={styles.subtexts}>가상 피팅 시 맞춤 사이즈 추천에 필요해요!</p>
              </div>

              <div className={styles.middleInfo}>
                <input
                  className={styles.profileNameInput2}
                  type="text"
                  placeholder="몸무게를 입력해주세요."
                  value={weight}
                  onChange={handleWeightChange}
                  autoFocus
                />
                <label className={styles.cm} htmlFor="">
                  kg
                </label>
                <p className={styles.line2}></p>
              </div>
            </section>

            <section className={styles.bottomButton3}>
              <p className={styles.subtexts2}>이제 마지막입니다!</p>
              <p className={`${styles.message} ${message ? styles.showMessage : ''}`}>{message}</p>
              <button className={styles.btn3} onClick={complete} disabled={isSubmitting}>
                {isSubmitting ? (
                  <img className={styles.loading} src="/src/assets/loading.gif" alt="로딩 중" />
                ) : (
                  "완료"
                )}
              </button>
            </section>
          </>
        )}
      </div>
    </>
  )
}

export default ProfileAdd

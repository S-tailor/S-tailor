import React, { startTransition, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileList, profileSelect } from '@/api/apiProfile'
import userStore from '@/store/store'
import styles from '../../../scss/profile.module.scss'

const Profile: React.FC = () => {
  interface UserProfile {
    profilePk: number
    image?: string
    profileName: string
  }
  const [userList, setUserList] = useState<UserProfile[]>([])
  const navigate = useNavigate()
  const { setUser } = userStore()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [modify, setModify] = useState<boolean>(false)

  // 유저 프로필 리스트 불러오기
  useEffect(() => {
    const id = String(localStorage.getItem('id'))
    fetchUser(id)
    sessionStorage.removeItem('profilePk')
  }, [])

  // 유저 프로필 리스트
  const fetchUser = async (id: string) => {
    const response = await profileList(id)
    

    setUserList(response.data.result)

    setIsLoading(!isLoading)
    setIsLoading(!isLoading)
  }

  // 유저 프로필 클릭시
  const userDetail = async (userPk: number) => {
    let Pk = String(userPk)
    sessionStorage.setItem('profilePk', Pk)
    let response = await profileSelect(userPk)
    if (response.status === 200) {
      setUser(response.data.result)
      startTransition(() => {
        navigate('/mobile/closet')
      })
    }
  }

  const profileModify = () => {
    setModify(!modify)
  }

  const profileModify2 = (profilePk: number) => {
    let Pk = String(profilePk)
    sessionStorage.setItem('profilePk', Pk)
    startTransition(() => {
      navigate('/mobile/profile/edit/')
    })
  }

  const goHome = () => {
    startTransition(() => {
      navigate('/')
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.bgVideo}>
        <video className={styles.bgVideoContent} autoPlay muted loop >
          <source src="/assets/background_light.mp4" />
        </video>
      </div>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <img
            onClick={goHome}
            className={styles.backBtn}
            src="/assets/backBtn.svg"
            alt="backBtn"
          />
          <button className={styles.editBtn} onClick={profileModify}>
            {modify ? '취소' : '수정'}
          </button>
        </div>
      </div>

      <section className={styles.topInfo}>
        <p className={styles.texts}>프로필 선택</p>
        <p className={styles.subtexts}>가상 피팅 서비스를 이용할 프로필을 선택하세요.</p>
      </section>

      {isLoading ? (
        <div className={styles.wait}>
          <img className={styles.loading} src="/assets/loading.gif" alt="로딩 중" />
        </div>
      ) : (
        <section className={styles.select}>
          <div className={styles.selectInner}>
            {userList.length > 0 ? (
              <div className={styles.memberContainer}>
                {userList[0] ? (
                  <div className={styles.member1}>
                    <p onClick={() => userDetail(userList[0].profilePk)}>
                      {userList[0].image && (
                        <img
                          className={`${styles.memberImg} ${modify ? styles.modify : ''}`}
                          src={userList[0].image}
                          alt="Uploaded Profile"
                        />
                      )}
                      <br />
                      <span className={styles.profileName}>{userList[0].profileName}</span>
                    </p>
                    {modify && (
                      <img
                        className={styles.editImg}
                        src="/assets/edit.svg"
                        alt="수정"
                        onClick={() => profileModify2(userList[0].profilePk)}
                      />
                    )}
                  </div>
                ) : (
                  <img
                    className={styles.addIcon}
                    src="/assets/add.svg"
                    alt="user-add"
                    onClick={() => {
                      startTransition(() => {
                        navigate('/mobile/profile/add')
                      })
                    }}
                  />
                )}
              </div>
            ) : (
              <img
                className={styles.addIcon}
                src="/assets/add.svg"
                alt="user-add"
                onClick={() => {
                  startTransition(() => {
                    navigate('/mobile/profile/add')
                  })
                }}
              />
            )}

            {userList.length > 1 ? (
              <div className={styles.memberContainer}>
                {userList[1] ? (
                  <div className={styles.member2}>
                    <p onClick={() => userDetail(userList[1].profilePk)}>
                      {userList[1].image && (
                        <img
                          className={`${styles.memberImg} ${modify ? styles.modify : ''}`}
                          src={userList[1].image}
                          alt="Uploaded Profile"
                        />
                      )}
                      <br />
                      <span className={styles.profileName}>{userList[1].profileName}</span>
                    </p>
                    {modify && (
                      <img
                        className={styles.editImg}
                        src="/assets/edit.svg"
                        alt="수정하기"
                        onClick={() => profileModify2(userList[1].profilePk)}
                      />
                    )}
                  </div>
                ) : (
                  <img
                    className={styles.addIcon}
                    src="/assets/add.svg"
                    alt="user-add"
                    onClick={() => {
                      startTransition(() => {
                        navigate('/mobile/profile/add')
                      })
                    }}
                  />
                )}
              </div>
            ) : (
              <img
                className={styles.addIcon}
                src="/assets/add.svg"
                alt="user-add"
                onClick={() => {
                  startTransition(() => {
                    navigate('/mobile/profile/add')
                  })
                }}
              />
            )}

            {userList.length > 2 ? (
              <div className={styles.memberContainer}>
                {userList[2] ? (
                  <div className={styles.member3}>
                    <p onClick={() => userDetail(userList[2].profilePk)}>
                      {userList[2].image && (
                        <img
                          className={`${styles.memberImg} ${modify ? styles.modify : ''}`}
                          src={userList[2].image}
                          alt="Uploaded Profile"
                        />
                      )}
                      <br />
                      <span className={styles.profileName}>{userList[2].profileName}</span>
                    </p>
                    {modify && (
                      <img
                        className={styles.editImg}
                        src="/assets/edit.svg"
                        alt="수정하기"
                        onClick={() => profileModify2(userList[2].profilePk)}
                      />
                    )}
                  </div>
                ) : (
                  <img
                    className={styles.addIcon}
                    src="/assets/add.svg"
                    alt="user-add"
                    onClick={() => {
                      startTransition(() => {
                        navigate('/mobile/profile/add')
                      })
                    }}
                  />
                )}
              </div>
            ) : (
              <img
                className={styles.addIcon}
                src="/assets/add.svg"
                alt="user-add"
                onClick={() => {
                  startTransition(() => {
                    navigate('/mobile/profile/add')
                  })
                }}
              />
            )}

            {userList.length > 3 ? (
              <div className={styles.memberContainer}>
                {userList[3] ? (
                  <div className={styles.member4}>
                    <p onClick={() => userDetail(userList[3].profilePk)}>
                      {userList[3].image && (
                        <img
                          className={`${styles.memberImg} ${modify ? styles.modify : ''}`}
                          src={userList[3].image}
                          alt="Uploaded Profile"
                        />
                      )}
                      <br />
                      <span className={styles.profileName}>{userList[3].profileName}</span>
                    </p>
                    {modify && (
                      <img
                        className={styles.editImg}
                        src="/assets/edit.svg"
                        alt="수정하기"
                        onClick={() => profileModify2(userList[3].profilePk)}
                      />
                    )}
                  </div>
                ) : (
                  <img
                    className={styles.addIcon}
                    src="/assets/add.svg"
                    alt="user-add"
                    onClick={() => {
                      startTransition(() => {
                        navigate('/mobile/profile/add')
                      })
                    }}
                  />
                )}
              </div>
            ) : (
              <img
                className={styles.addIcon}
                src="/assets/add.svg"
                alt="user-add"
                onClick={() => {
                  startTransition(() => {
                    navigate('/mobile/profile/add')
                  })
                }}
              />
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default Profile

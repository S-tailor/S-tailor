import React, {Suspense, startTransition, useEffect, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { profileList, profileSelect } from '@/api/apiProfile'
import userStore from '@/store/store'
import styles from '../../../scss/profile.module.scss';

const Profile: React.FC = () => {
  interface UserProfile {
    profilePk: number;
    image?: string;
    profileName: string;
  }
  const [userList, setUserList] = useState<UserProfile[]>([]); 
  const navigate = useNavigate()
  
  const {setUser} = userStore()


  const goBack = () => {
    
    startTransition(() => {
    navigate('/')
    })
  }

  const userAdd = () => {
    startTransition(() => {
      navigate('add')
    })
  }
  useEffect(()=>{
    const id = String(localStorage.getItem('id'))
    fetchUser(id)  
  },[])

 
  const fetchUser = async (id:string) => {
    
    const response = await profileList(id)
    setUserList(response.data.result);
    
   
  }

  const userDetail = async (userPk:number) => {
    console.log('유저번호',userPk)
    let response = await profileSelect(userPk)
    if (response.status === 200) {
      console.log(response.data.result)
      setUser(response.data.result)
      startTransition(() => {
        navigate('/mobile/closet')
      })
    }
  }


  return (
    <div className={styles.container}>
      <Suspense>

      <header>
        <div className={styles.headerInner}>
          <Link to={'/'}>
            <img className={styles.backBtn} src="/src/assets/backBtn.svg" alt="backBtn" />
          </Link>
        </div>
      </header>

      <section className={styles.topInfo}>
        <p className={styles.texts}>프로필 선택</p>
        <p className={styles.subtexts}>가상 피팅 서비스를 이용할 프로필을 선택하세요.</p>
      </section>

      <section className={styles.select}>
        <div className={styles.selectInner}>
          {userList.length > 0 ? (
            <>
              {userList[0] ? (
                <div className={styles.member1}>
                  <p onClick={() => userDetail(userList[0].profilePk)}>
                    {userList[0].image && <img className={styles.member1Img} src={userList[0].image} alt="Uploaded Profile" />}
                    <br />
                    {userList[0].profileName}
                  </p>
                </div>
              ) : (
                <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={userAdd} />
              )}
            </>
          ) : <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={userAdd} />}

          {userList.length > 1 ? (
            <>
              {userList[1] ? (
                <div className={styles.member2}>
                  <p onClick={() => userDetail(userList[1].profilePk)}>
                    {userList[1].image && <img className={styles.member2Img} src={userList[1].image} alt="Uploaded Profile" />}
                    <br />
                    {userList[1].profileName}
                  </p>
                </div>
              ) : (
                <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={userAdd} />
              )}
            </>
          ) : <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={userAdd} />}

          {userList.length > 2 ? (
            <>
            
              {userList[2] ? (
                <div className={styles.member3}>
                  <p onClick={() => userDetail(userList[2].profilePk)}>
                    {userList[2].image && <img className={styles.member3Img} src={userList[2].image} alt="Uploaded Profile" />}
                    <br />
                    {userList[2].profileName}
                  </p>
                </div>
              ) : (
                <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={userAdd} />
              )}
            </>
          ) : <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={userAdd} />}

          {userList.length > 3 ? (
            <>
              {userList[3] ? (
                <div className={styles.member4}>
                  <p onClick={() => userDetail(userList[3].profilePk)}>
                    {userList[3].image && <img className={styles.member4Img} src={userList[3].image} alt="Uploaded Profile" />}
                    <br />
                    {userList[3].profileName}
                  </p>
                </div>
              ) : (
                <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={userAdd} />
              )}
            </>
          ) : <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={userAdd} />}
        </div>
      </section>

      </Suspense>
    </div>
  )
}

export default Profile

import React, {Suspense, startTransition, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 유저 프로필 리스트 불러오기
  useEffect(()=>{
    const id = String(localStorage.getItem('id'))
      fetchUser(id)  
  },[])

 // 유저 프로필 리스트
  const fetchUser = async (id:string) => {
    const response = await profileList(id)
    setTimeout(() => {
      setUserList(response.data.result);
      setIsLoading(!isLoading);
    }, 100);
  }

  // 유저 프로필 클릭시 
  const userDetail = async (userPk:number) => {
    let response = await profileSelect(userPk)
    if (response.status === 200) {
     
      setUser(response.data.result)
      startTransition(() => {
        navigate('/mobile/closet')
      })
    }
  }

  const goHome = () => {
    startTransition(() => {
      navigate('/')
    })
  }


  return (
    <div className={styles.container}>
      <Suspense>

      <header>
        <div className={styles.headerInner}>
          <img onClick={goHome} className={styles.backBtn} src="/src/assets/backBtn.svg" alt="backBtn" />
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
                <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={()=>{
                  startTransition(()=>{navigate('/mobile/profile/add')})}} />
              )}
            </>
          ) : <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={()=>{
            startTransition(()=>{navigate('/mobile/profile/add')})}} />}

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
                <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={()=>{
                  startTransition(()=>{navigate('/mobile/profile/add')})}} />
              )}
            </>
          ) : <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={()=>{
            startTransition(()=>{navigate('/mobile/profile/add')})}} />}

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
                <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={()=>{
                  startTransition(()=>{navigate('/mobile/profile/add')})}} />
              )}
            </>
          ) : <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={()=>{
            startTransition(()=>{navigate('/mobile/profile/add')})}} />}

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
                <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={()=>{
                  startTransition(()=>{navigate('/mobile/profile/add')})}} />
              )}
            </>
          ) : <img className={styles.addIcon} src="/src/assets/add.svg" alt="user-add" onClick={()=>{
            startTransition(()=>{navigate('/mobile/profile/add')})}} />}
        </div>
      </section>

      </Suspense>
    </div>
  )
}

export default Profile

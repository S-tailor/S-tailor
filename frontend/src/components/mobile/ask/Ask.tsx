import React, { useState, useMemo, startTransition } from 'react'
import userStore from '@/store/store'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../../../scss/ask.module.scss';

const Ask: React.FC = () => {

  const location = useLocation();
  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[];
  };
  const userName= user[0]?.profileName  ?? 'Guest'
  const navigate = useNavigate()

  /////////// 하단 내비게이션 바 선택 시 아이콘(컬러) 변경 //////////////
  const getIconSrc = (iconName: string) => {
    const path = location.pathname
    const iconPaths: { [key: string]: { [icon: string]: string } } = {
      '/mobile/closet': {
        'closet': '/src/assets/closetFill.png',
        'add-cloth': '/src/assets/upload.png',
        'ask': '/src/assets/shirt.png',
        'mypage': user[0]?.image || "/src/assets/avatar.PNG"
      },
      '/mobile/add-cloth': {
        'closet': '/src/assets/closet.png',
        'add-cloth': '/src/assets/uploadFill.png',
        'ask': '/src/assets/shirt.png',
        'mypage': user[0]?.image || "/src/assets/avatar.PNG"
      },
      '/mobile/ask': {
        'closet': '/src/assets/closet.png',
        'add-cloth': '/src/assets/upload.png',
        'ask': '/src/assets/shirtFill.png',
        'mypage': user[0]?.image || "/src/assets/avatar.PNG"
      },
      '/mobile/mypage': {
        'closet': '/src/assets/closet.png',
        'add-cloth': '/src/assets/upload.png',
        'ask': '/src/assets/shirt.png',
        'mypage': user[0]?.image || "/src/assets/avatar.PNG"
      }
    }
    return iconPaths[path][iconName] || '/src/assets/' + iconName + '.png';
  }

  const getMypageImgStyle = useMemo(() => {
    return location.pathname === '/mobile/mypage' ? { border: '2px solid #9091FB', width: '9.5vw', height: '4.5vh', marginTop: '-2px'} : { filter: 'drop-shadow(0px 0px 1.5px #000000)' };
  }, [location.pathname])

  const getActiveStyle = (path: string) => {
    return location.pathname === path ? { fontFamily: 'Pretendard-Bold', color: '#9091FB', marginTop: '2px' } : {}
  }
  ////////////////////////////////////////////////////////////////////

  return (
    <div>
      <h1>Ask Component</h1>

      <footer className={styles.bottomNav}>
        <div className={styles.bottomNavInner}>
            <label className={styles.bottomNavInnerBtn}>
              <img 
                className={styles.closetImg}
                src={getIconSrc('closet')}
                alt="closet-home" 
                onClick={()=>{
                startTransition(()=>{
                  navigate('/mobile/closet')})} 
                }
              />
              <p className={styles.bottomNavLabel1} style={getActiveStyle('/mobile/closet')}>옷장 홈</p>
            </label>
           
            <label className={styles.bottomNavInnerBtn}>
              <img 
                className={styles.addClothesImg}
                src={getIconSrc('add-cloth')} 
                alt="clothes-add" 
                onClick={()=>{
                startTransition(()=>{
                  navigate('/mobile/add-cloth')})} 
                }
              />
              <p className={styles.bottomNavLabel2} style={getActiveStyle('/mobile/add-cloth')}>옷 추가하기</p>
            </label>

            <label className={styles.bottomNavInnerBtn}>
              <img 
                className={styles.recommendImg}
                src={getIconSrc('ask')} 
                alt="style-recomm" 
                onClick={()=>{
                startTransition(()=>{
                  navigate('/mobile/ask')})} 
                }
              />
              <p className={styles.bottomNavLabel3} style={getActiveStyle('/mobile/ask')}>스타일추천</p>
            </label>

            <label className={styles.bottomNavInnerBtn}>
              <img 
                className={styles.mypageImg}
                src={getIconSrc('mypage')}
                alt="myPage" 
                style={getMypageImgStyle}
                onClick={() => {
                  startTransition(() => {
                    navigate('/mobile/mypage')
                  })
                }}
              />
              <p className={styles.bottomNavLabel4} style={getActiveStyle('/mobile/mypage')}>마이페이지</p>
            </label>
        </div>
      </footer>
    </div>
  )
}

export default Ask

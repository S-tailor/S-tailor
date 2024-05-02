import React,{startTransition, useMemo, useState, useRef} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { chatbot } from '@/api/apiAsk'
import userStore from '@/store/store'
import styles from '../../../scss/ask.module.scss';

const Ask: React.FC = () => {
  
  const [fileUrl, setFileUrl] = useState<string>("")
  const [file, setFile] = useState<File | null>();
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<{ sender: string, text: string, image:string }[]>([]);
  const navigate = useNavigate()
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formData = new FormData()
  // const {user} = userStore()
  const [isLoading, setIsLoading] = useState(false)
  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[];
  };
  const userName = localStorage.getItem('id')
  
  const saveText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)

  }

  const sendInfo = async () => {
    setText('')
    setFileUrl(''); 
    setFile(null);
    if (!text) return;  // 텍스트가 비어있는 경우 전송하지 않음
    const newMessage = { sender: 'user', text: text, image: fileUrl };
    setMessages([...messages, newMessage]);

    setIsLoading(true)
    const profilePk = String(sessionStorage.getItem('profilePk'))
    formData.append('profile',profilePk)
    formData.append('text',text)
    if (file) {
      formData.append('image', file)
    }

    await chatbot(formData)
    .then((response)=>{
      const botResponse = { sender: 'bot', text: response.data.body, image: fileUrl };
      setMessages(prev => [...prev, botResponse]);

    })
    .catch(()=>{
      const errorMessage = { sender: 'bot', text: '오류가 발생했습니다.',image: fileUrl };
      setMessages(prev => [...prev, errorMessage]);
    })
    setIsLoading(false)
    
    
  }

  const changePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
    const fileUrl = URL.createObjectURL(selectedFile); 
    setFileUrl(fileUrl);
    setFile(selectedFile)
  } else {
    console.error('No file selected')
  }
  }

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
    return location.pathname === path ? { fontFamily: 'Pretendard-Bold', color: '#9091FB', marginTop: '1px' } : {}
  }
  ////////////////////////////////////////////////////////////////////

  
    return (
    <div>
      <header>
        <img src="" alt="search" onClick={()=>{
          startTransition(()=>{
            navigate('/mobile/closet/search')})}}
            />
             <img src="" alt="cart" onClick={()=>{
               startTransition(()=>{
                 navigate('/mobile/closet/wishlist')})}} 
                 />
                 <h1>스타일 추천</h1>
                 <p>* 페이지를 벗어나면 대화가 사라집니다.</p>
      </header>
      <hr />

      <div>
       <div >
          {messages.map((msg, index) => (
            <p key={index} className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
              {/* 여기서 className이 user면 왼쪽으로 bot이면 오른쪽으로 정렬  */}
           {msg.sender === 'user' ? `${userName} 님: ` : 'S-Tailor: '}
            <br />
            
            {msg.image && <img src={msg.image} alt="전송한 사진" 
            style={{ maxWidth: '100px' }} />}
            <br />
           {msg.text}
            </p>
          ))}
        </div>

          {isLoading &&
          <img src="" alt="로딩중" />
          }
        
    



      </div>
   
        <hr />
        <img src="" alt="플러스버튼" onClick={()=>{fileInputRef.current?.click()}}/>
        <input id="profileImg" type="file" style={{ display: 'none' }} onChange={changePic} ref={fileInputRef}  ></input>
        {file && <img src={fileUrl} alt="Uploaded Image" style={{width:'100px'}}/>}
        <img src="" alt="이미지삭제" onClick={() => { setFileUrl(''); setFile(null); }}/>
        <input type="text" onChange={saveText} value={text}/>
        <button>
        <img src="" alt="삼각형의 전송버튼" onClick={sendInfo}/>
        </button>
    
      
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

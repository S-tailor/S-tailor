import React,{startTransition, useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { chatbot, reset } from '@/api/apiAsk'


const Ask: React.FC = () => {
  
  const [fileUrl, setFileUrl] = useState<string>("")
  const [file, setFile] = useState<File | null>();
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<{ sender: string, text: string, image:string }[]>([]);
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formData = new FormData()
  // const {user} = userStore()
  const [isLoading, setIsLoading] = useState(false)
  const userName = localStorage.getItem('id')
  
  const profilePk = String(sessionStorage.getItem('profilePk'))
  const saveText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)

  }



  const resetConversation = async() => {
    await reset(profilePk)
    .then((response)=>{console.log(response)})
    .catch(()=>{console.error})
  }


  const sendInfo = async () => {
    setText('')
    setFileUrl(''); 
    setFile(null);
    if (!text) return;  // 텍스트가 비어있는 경우 전송하지 않음
    const newMessage = { sender: 'user', text: text, image: fileUrl };
    setMessages([...messages, newMessage]);

    setIsLoading(true)
   
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

  
    return (
    <div>
      <header>
        <img src="" alt="search" onClick={()=>{
          startTransition(()=>{
            resetConversation()
            navigate('/mobile/closet/search')})}}
            />
             <img src="" alt="cart" onClick={()=>{
               startTransition(()=>{
                resetConversation()
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
    
      
      <footer>
        <img src="" alt="closet-home" onClick={()=>{
        startTransition(()=>{
          resetConversation()
          navigate('/mobile/closet')})} 
        }
        />
        <img src="" alt="clothes-add" onClick={()=>{
        startTransition(()=>{
          resetConversation()
          navigate('/mobile/add-cloth')})} 
        }
        />
        <img src="" alt="style-recomm" onClick={()=>{
        startTransition(()=>{
          resetConversation()
          navigate('/mobile/ask')})} 
        }
        />
        <img src="" alt="myPage" onClick={()=>{
        startTransition(()=>{
          resetConversation()
          navigate('/mobile/mypage')})} 
        }
        />
      </footer>
    </div>
)
}

export default Ask

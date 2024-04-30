import React,{startTransition, useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { chatbot } from '@/api/apiAsk'
import userStore from '@/store/store'

const Ask: React.FC = () => {
  

  const [fileUrl, setFileUrl] = useState<string>("")
  const [file, setFile] = useState<File>();
  const [text, setText] = useState<string>('');
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formData = new FormData()
  const {user} = userStore()

  
  
  const saveText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const sendInfo = async () => {
    console.log('전송됨')
    if (user.length > 0) {
      const profilePk = String(user[0].profilePk)
      formData.append('profile',profilePk)
    }
    formData.append('text',text)
    if (file) {
      formData.append('image', file)
    }
    await chatbot(formData)
    .then((response)=>{
      console.log(response)
    })
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
            navigate('/mobile/closet/search')})}}
            />
             <img src="" alt="cart" onClick={()=>{
               startTransition(()=>{
                 navigate('/mobile/closet/wishlist')})}} 
                 />
                 <h1>스타일 추천</h1>
      </header>
      <hr />
      <div>
          
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        // form 제출 로직
      }}>
        <hr />
        <img src="" alt="플러스버튼" onClick={()=>{fileInputRef.current?.click()}}/>
        <input id="profileImg" type="file" style={{ display: 'none' }} onChange={changePic} ref={fileInputRef}></input>
      {file  && <img src={fileUrl} alt="" />}
      <img src="" alt="이미지삭제" onClick={()=>{setFileUrl('')}}/>
        <input type="text" onChange={saveText} />
        <button>
          <img src="" alt="삼각형의 전송버튼" onClick={sendInfo}/>
        </button>
      </form>
      
      <footer>
        <img src="" alt="closet-home" onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/closet')})} 
        }
        />
        <img src="" alt="clothes-add" onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/add-cloth')})} 
        }
        />
        <img src="" alt="style-recomm" onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/ask')})} 
        }
        />
        <img src="" alt="myPage" onClick={()=>{
        startTransition(()=>{
          navigate('/mobile/mypage')})} 
        }
        />
      </footer>
    </div>
  )
}

export default Ask

import React,{ startTransition }  from 'react'
import { useNavigate } from 'react-router-dom'

const ClosetCodeInput: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div>
         <img src="" alt="back" onClick={()=>
       startTransition(()=>{navigate('/mobile/closet')})} 
     />
      <header>
        <h3>옷 입어보기</h3>
        </header>

      <h1>인증코드 입력</h1>
      <p>기기에 표시된 6자리 번호를 입력해주세요.</p>

      <button onClick={()=>{startTransition(()=>{
        navigate('/mobile/closet/tryon/wait')
      })}}>완료</button>
    </div>
  )
}

export default ClosetCodeInput

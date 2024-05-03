import { useState } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const FlipMain: React.FC = () => {
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const function1 = (event:any) => {
    if (event)
      setMessage('환영합니다! 이제 S-Tailor와 함께할 시간')
      setTimeout(()=>{
        navigate('/flip/tryon/test')
  },3000)
}
  return (
    <div onTouchStart={function1}>
      <h1>FlipMain Component</h1>
      <br />
      {!message ?
      <h2>터치로 시작하기</h2>
      :
      <h2>{message}</h2>
      }
    </div>
  )
}

export default FlipMain

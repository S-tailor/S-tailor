import React from 'react'
import { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'

const ClosetWait: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div>
      <img src="" alt="연결" />
      <br />
      <p>연결이 완료되었습니다!</p>
      <p>기기화면을 통해 가상피팅서비스를 즐겨주세요 :)</p>
      <br />
      <button onClick={()=>{startTransition(()=>{
        navigate('/mobile/closet')
      })}}>옷장으로 돌아가기</button>
    </div>
  )
}

export default ClosetWait

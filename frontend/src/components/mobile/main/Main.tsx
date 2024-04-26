import React, { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'

const Main: React.FC = () => {
  const navigate = useNavigate()

  const StartClick = () => {
    startTransition(() => {
      navigate('/mobile/start')
    })
  }

  return (
    <div>
      <h1>Main Component</h1>
      <button onClick={StartClick}>시작하기</button>
    </div>
  )
}

export default Main

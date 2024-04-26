import React from 'react'
import {useNavigate} from 'react-router-dom'

const Main: React.FC = () => {
  const navigate = useNavigate()
  const moveToEmail = () => {
    navigate('/mobile/login')
  }
  return (
    <div>
      <button onClick={moveToEmail}>시작하기</button>
      <h1>Main Component</h1>
    </div>
  )
}

export default Main

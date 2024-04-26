import React, {startTransition} from 'react'
import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const goBack = () => {
    startTransition(() => {
    navigate('/')
    })
  }


  return (
    <div>
      
      <img src="" alt="back" onClick={goBack} />

      <h1>Profile Component</h1>
    
    
    
    </div>
  )
}

export default Profile

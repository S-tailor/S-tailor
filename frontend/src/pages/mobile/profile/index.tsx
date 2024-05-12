import React from 'react'
import { Outlet } from 'react-router-dom'

const Profile: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Profile

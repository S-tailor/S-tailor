import React from 'react'
import { Outlet } from 'react-router-dom'

const MyPage: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default MyPage

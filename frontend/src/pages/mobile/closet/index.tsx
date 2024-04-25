import React from 'react'
import { Outlet } from 'react-router-dom'

const Closet: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Closet

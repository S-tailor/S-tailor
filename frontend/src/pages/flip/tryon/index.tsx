import React from 'react'
import { Outlet } from 'react-router-dom'

const TryOn: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default TryOn

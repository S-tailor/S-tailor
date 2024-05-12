import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import RenderRoutes from './routes';

import { startTransition, useEffect } from 'react'

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(() => { 
          })
          .catch((err) => {
            console.log('Service Worker registration failed:', err)
          })
      })
    }
  }, [])

  return (
    <Router>
      <RenderRoutesWithTransition />
    </Router>
  )
}

function RenderRoutesWithTransition() {
  const fetchData = () => {
    // 비동기 데이터 로딩 시작
    startTransition(() => {
      // 데이터 가져오는 비동기 작업
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return <RenderRoutes />
}

export default App

import { useState } from 'react'
import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Dashboard'

const App = () => {
  const [page, setPage] = useState('login')
  const [loggedIn, setLoggedIn] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setLoggedIn(false)
  }

  const centered = 'min-h-screen flex items-center justify-center'

  if (loggedIn) return <div className={centered}><Dashboard onLogout={handleLogout} /></div>

  if (page === 'register')
    return <div className={centered}><Register onSwitch={() => setPage('login')} /></div>

  return <div className={centered}><Login onLogin={() => setLoggedIn(true)} onSwitch={() => setPage('register')} /></div>
}

export default App

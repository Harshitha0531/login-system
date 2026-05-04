import { useState } from 'react'
import Landing from './Components/Landing'
import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Dashboard'

const App = () => {
  const [page, setPage] = useState('landing')
  const [loggedIn, setLoggedIn] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setLoggedIn(false)
    setPage('landing')
  }

  // if logged in and on dashboard, show dashboard
  if (loggedIn && page === 'dashboard') return <Dashboard onLogout={handleLogout} onHome={() => setPage('landing')} />

  if (page === 'login') return <Login onLogin={() => { setLoggedIn(true); setPage('dashboard') }} onSwitch={() => setPage('register')} onBack={() => setPage('landing')} />
  if (page === 'register') return <Register onSwitch={() => setPage('login')} onBack={() => setPage('landing')} />

  // landing page — if already logged in, Login button goes back to dashboard
  return <Landing
    onLogin={() => loggedIn ? setPage('dashboard') : setPage('login')}
    onRegister={() => setPage('register')}
    loggedIn={loggedIn}
  />
}

export default App

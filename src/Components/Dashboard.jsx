import { useState } from 'react'
import api from '../api'

const Dashboard = ({ onLogout }) => {
  const [profileEmail, setProfileEmail] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const handleGetProfile = async () => {
    try {
      console.log('%c[PROFILE] Calling protected /profile route...', 'color: blue')
      console.log('%c[PROFILE] Using Access Token:', 'color: blue', localStorage.getItem('accessToken'))
      const response = await api.get('/profile')
      console.log('%c[PROFILE] Success! Server responded with:', 'color: green', response.data)
      setProfileEmail(response.data.user.email)
      setShowPopup(true)
    } catch (error) {
      console.log('%c[PROFILE] Failed:', 'color: red', error.response?.data)
    }
  }

  const handleLogout = async () => {
    console.log('%c[LOGOUT] Invalidating refresh token on server...', 'color: orange')
    const rt = localStorage.getItem('refreshToken')
    await api.post('/logout', { refreshToken: rt })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    console.log('%c[LOGOUT] Tokens cleared. User logged out.', 'color: red')
    onLogout()
  }

  return (
    <div className='bg-sky-200 space-y-4 p-5 rounded-md shadow-md w-84'>
      <p className='font-semibold text-lg text-center'>Dashboard</p>
      <button
        onClick={handleGetProfile}
        className='bg-green-600 px-4 py-1 rounded-md shadow-md text-white w-full'
      >
        Get Profile
      </button>
      <button
        onClick={handleLogout}
        className='bg-red-500 px-4 py-1 rounded-md shadow-md text-white w-full'
      >
        Logout
      </button>

      {showPopup && (
        <div className='fixed inset-0 flex items-center justify-center'>
          <div className='bg-white border border-gray-200 rounded-md shadow-lg p-4 space-y-2 text-center'>
            <p className='text-sm text-gray-500'>Logged in as</p>
            <p className='font-medium text-blue-700 text-sm'>{profileEmail}</p>
            <button
              onClick={() => setShowPopup(false)}
              className='bg-blue-600 px-3 py-1 rounded-md text-white text-xs w-full'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

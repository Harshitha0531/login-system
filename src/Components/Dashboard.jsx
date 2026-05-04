import { useState } from 'react'
import { BiSolidShoppingBagAlt } from 'react-icons/bi'
import { FiLogOut } from 'react-icons/fi'
import api from '../api'
import TodoList from './TodoList'

const Dashboard = ({ onLogout, onHome }) => {
  const [profileEmail, setProfileEmail] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const handleGetProfile = async () => {
    try {
      console.log('%c[PROFILE] Calling protected /profile route...', 'color: blue')
      const response = await api.get('/profile')
      console.log('%c[PROFILE] Success!', 'color: green', response.data)
      setProfileEmail(response.data.user.email)
      setShowPopup(true)
    } catch (error) {
      console.log('%c[PROFILE] Failed:', 'color: red', error.response?.data)
    }
  }

  const handleLogout = async () => {
    console.log('%c[LOGOUT] Logging out...', 'color: orange')
    const rt = localStorage.getItem('refreshToken')
    await api.post('/logout', { refreshToken: rt })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    console.log('%c[LOGOUT] Tokens cleared.', 'color: red')
    onLogout()
  }

  return (
    <div className='min-h-screen w-full bg-slate-50'>

      {/* Top navbar */}
      <div className='flex items-center justify-between px-10 py-4 bg-white shadow-sm'>
        <div className='flex items-center gap-3'>
          <button onClick={onHome} className='text-gray-400 hover:text-blue-600 text-xl transition'>&#8592;</button>
          <BiSolidShoppingBagAlt className='text-blue-600 text-2xl' />
          <span className='font-bold text-lg text-blue-600'>AuthFlow</span>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={handleGetProfile}
            className='text-sm text-blue-600 border border-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition'
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className='flex items-center gap-1 text-sm text-red-500 border border-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 transition'
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Todo content */}
      <div className='flex justify-center items-start pt-10'>
        <TodoList />
      </div>

      {/* Profile popup */}
      {showPopup && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-20'>
          <div className='bg-white rounded-xl shadow-xl p-6 w-72 text-center'>
            <div className='text-4xl mb-3'>👤</div>
            <p className='text-gray-500 text-sm mb-1'>Logged in as</p>
            <p className='font-semibold text-blue-600 text-sm mb-4'>{profileEmail}</p>
            <button
              onClick={() => setShowPopup(false)}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition'
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

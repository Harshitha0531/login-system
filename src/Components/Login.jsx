import { useState } from 'react'
import { BiSolidShoppingBagAlt } from 'react-icons/bi'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import api from '../api'

const Login = ({ onLogin, onSwitch, onBack }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      console.log('%c[LOGIN] Sending credentials to server...', 'color: blue')
      const response = await api.post('/login', { email, password })
      const { accessToken, refreshToken } = response.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      console.log('%c[LOGIN] Success! Tokens received:', 'color: green')
      console.log('  Access Token (expires in 15m):', accessToken)
      console.log('  Refresh Token (expires in 7d):', refreshToken)
      console.log('%c[LOGIN] Decoded Access Token payload:', 'color: green', JSON.parse(atob(accessToken.split('.')[1])))

      onLogin()
    } catch (error) {
      setMessage('Login failed: ' + error.response?.data?.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center w-full min-h-screen bg-slate-50'>
      <div className='flex rounded-2xl overflow-hidden shadow-xl w-full max-w-4xl'>

        {/* Left - Form */}
        <div className='w-1/2 bg-white px-16 py-12 flex flex-col justify-center'>
          <div className='flex items-center gap-2 mb-6'>
            <BiSolidShoppingBagAlt className='text-blue-600 text-2xl' />
            <span className='font-bold text-lg text-blue-600'>AuthFlow</span>
          </div>
          <button onClick={onBack} className='flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 mb-4 w-fit transition'>
            &#8592; Back
          </button>

          <h1 className='text-3xl font-bold text-neutral-900 mb-1'>Log in to your Account</h1>
          <p className='text-gray-500 text-sm mb-6'>Welcome back! Enter your credentials to continue.</p>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-gray-700'>Email</label>
              <input
                type='email'
                autoComplete='off'
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                className='mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700'>Password</label>
              <div className='relative mt-1'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10'
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-2.5 text-gray-400 cursor-pointer'
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>

          {message && <p className='text-red-500 text-xs mt-3'>{message}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className='mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className='text-sm text-center text-gray-500 mt-4'>
            Don't have an account?{' '}
            <span onClick={onSwitch} className='text-blue-600 font-medium cursor-pointer hover:underline'>
              Register
            </span>
          </p>
        </div>

        {/* Right - Illustration */}
        <div className='w-1/2 bg-blue-600 flex flex-col justify-center items-center px-10 py-12 text-white'>
          <div className='text-6xl mb-6'>🔐</div>
          <h2 className='text-2xl font-bold text-center mb-2'>Connect with every application</h2>
          <div className='flex gap-2'>
            <div className='w-2 h-2 bg-white rounded-full'></div>
            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login

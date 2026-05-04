import { useState } from 'react'
import { BiSolidShoppingBagAlt } from 'react-icons/bi'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import api from '../api'

const Register = ({ onSwitch, onBack }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null
    const checks = [
      pwd.length >= 8,
      /[A-Z]/.test(pwd),
      /[a-z]/.test(pwd),
      /\d/.test(pwd),
      /[@$!%*?&]/.test(pwd),
    ]
    const passed = checks.filter(Boolean).length
    if (passed <= 2) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/3' }
    if (passed <= 4) return { label: 'Medium', color: 'bg-yellow-400', width: 'w-2/3' }
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' }
  }

  const strength = getPasswordStrength(password)

  const handleRegister = async () => {
    if (!email || !password) {
      setMessage('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      await api.post('/register', { email, password })
      setMessage('Registered successfully! Redirecting to login...')
      setTimeout(() => onSwitch(), 2000)
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.error)
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

          <h1 className='text-3xl font-bold text-neutral-900 mb-1'>Create an Account</h1>
          <p className='text-gray-500 text-sm mb-6'>Sign up to get started today.</p>

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
                  placeholder='Create a password'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10'
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-2.5 text-gray-400 cursor-pointer'
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {strength && (
                <div className='mt-2'>
                  <div className='w-full bg-gray-200 rounded-full h-1.5'>
                    <div className={`${strength.color} ${strength.width} h-1.5 rounded-full transition-all`}></div>
                  </div>
                  <p className={`text-xs mt-1 ${strength.label === 'Weak' ? 'text-red-500' : strength.label === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>
          </div>

          {message && (
            <p className={`text-xs mt-3 ${message.includes('Registered') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className='mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition'
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className='text-sm text-center text-gray-500 mt-4'>
            Already have an account?{' '}
            <span onClick={onSwitch} className='text-blue-600 font-medium cursor-pointer hover:underline'>
              Login
            </span>
          </p>
        </div>

        {/* Right - Illustration */}
        <div className='w-1/2 bg-blue-600 flex flex-col justify-center items-center px-10 py-12 text-white'>
          <div className='text-6xl mb-6'>🔐</div>
          <h2 className='text-2xl font-bold text-center mb-2'>Connect with every application</h2>
          <div className='flex gap-2'>
            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
            <div className='w-2 h-2 bg-white rounded-full'></div>
            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Register

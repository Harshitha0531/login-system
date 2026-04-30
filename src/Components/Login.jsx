import { useState } from 'react'
import api from '../api'

const Login = ({ onLogin, onSwitch }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage('Please fill in all fields.')
      return
    }
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
    }
  }

  return (
    <div className='bg-sky-200 space-y-4 p-5 rounded-md shadow-md w-84'>
      <p className='font-semibold text-lg text-center'>Login</p>
      <div>
        <p>Email</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="off"
          className='border rounded-md shadow-md w-full p-1'
        />
      </div>
      <div>
        <p>Password</p>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          className='border rounded-md shadow-md w-full p-1'
        />
      </div>
      <button
        onClick={handleSubmit}
        className='bg-blue-600 px-4 py-1 rounded-md shadow-md text-white w-full'
      >
        Login
      </button>
      <p className='text-sm text-center cursor-pointer text-blue-700' onClick={onSwitch}>
        Don't have an account? Register
      </p>
      {message && <p className='text-sm text-center'>{message}</p>}
    </div>
  )
}

export default Login

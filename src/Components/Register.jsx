import { useState } from 'react'
import api from '../api'

const Register = ({ onSwitch }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    if (!email || !password) {
      setMessage('Please fill in all fields.')
      return
    }
    try {
      await api.post('/register', { email, password })
      setMessage('Registered! You can now login.')
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.error)
    }
  }

  return (
    <div className='bg-sky-200 space-y-4 p-5 rounded-md shadow-md w-84'>
      <div className='flex items-center gap-2'>
        <span onClick={onSwitch} className='cursor-pointer text-xl'>&#8592;</span>
        <p className='font-semibold text-lg'>Register</p>
      </div>
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
        onClick={handleRegister}
        className='bg-blue-600 px-4 py-1 rounded-md shadow-md text-white w-full'
      >
        Register
      </button>
      <p className='text-sm text-center cursor-pointer text-blue-700' onClick={onSwitch}>
        Already have an account? Login
      </p>
      {message && <p className='text-sm text-center'>{message}</p>}
    </div>
  )
}

export default Register

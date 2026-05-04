import { useState, useEffect, useRef } from 'react'
import { BiSolidShoppingBagAlt } from 'react-icons/bi'

const headlines = [
  { main: 'Manage Your Tasks with ', highlight: 'Clarity and Control.' },
  { main: 'Stay Organized, ', highlight: 'Stay Productive.' },
  { main: 'Your Private Workspace, ', highlight: 'Always in Sync.' },
]

const SUBTEXT = 'Create your account and access a secure, personalized workspace. Organize, track, and complete tasks effortlessly - your data stays private and synced.'

const Landing = ({ onLogin, onRegister, loggedIn }) => {
  const [displayed, setDisplayed] = useState('')
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const timerRef = useRef(null)

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => {
    const { main, highlight } = headlines[headlineIndex]
    const fullText = main + highlight
    let i = 0

    // type forward
    const type = () => {
      clearTimer()
      timerRef.current = setInterval(() => {
        i++
        setDisplayed(fullText.slice(0, i))
        if (i >= fullText.length) {
          clearTimer()
          setTimeout(erase, 2000) // pause then erase
        }
      }, 50)
    }

    // erase backward
    const erase = () => {
      let j = fullText.length
      timerRef.current = setInterval(() => {
        j--
        setDisplayed(fullText.slice(0, j))
        if (j <= 0) {
          clearTimer()
          setDisplayed('')
          setHeadlineIndex((prev) => (prev + 1) % headlines.length)
        }
      }, 30)
    }

    type()
    return clearTimer
  }, [headlineIndex])

  const { main } = headlines[headlineIndex]
  const plainPart = displayed.slice(0, Math.min(displayed.length, main.length))
  const highlightPart = displayed.length > main.length ? displayed.slice(main.length) : ''

  return (
    <div className='min-h-screen w-full bg-slate-50 flex flex-col'>

      {/* Navbar */}
      <div className='flex items-center justify-between px-10 py-4 bg-white shadow-sm animate-fade-up delay-1'>
        <div className='flex items-center gap-2'>
          <BiSolidShoppingBagAlt className='text-blue-600 text-2xl' />
          <span className='font-bold text-lg text-blue-600'>AuthFlow</span>
        </div>
        <div className='flex gap-3'>
          <button
            onClick={onLogin}
            className='text-sm text-blue-600 border border-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition'
          >
            {loggedIn ? 'Go to Dashboard' : 'Login'}
          </button>
          {!loggedIn && (
            <button
              onClick={onRegister}
              className='text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition'
            >
              Register
            </button>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className='flex-1 flex flex-col items-center justify-center text-center px-6'>

        <div className='min-h-[200px] flex items-center justify-center mb-8'>
          <h1 className='text-8xl font-extrabold text-neutral-900 leading-tight max-w-6xl'>
            {plainPart}
            {highlightPart && <span className='gradient-text'>{highlightPart}</span>}
            <span className='animate-pulse text-blue-600'>|</span>
          </h1>
        </div>

        <p className='text-gray-600 text-2xl max-w-3xl animate-fade-up delay-3'>
          {SUBTEXT}
        </p>

      </div>

    </div>
  )
}

export default Landing

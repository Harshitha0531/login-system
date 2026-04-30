import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))

// secrets — in a real app these go in .env file
const ACCESS_SECRET = 'access_secret_key'
const REFRESH_SECRET = 'refresh_secret_key'

// fake in-memory user db
const users = []

// store refresh tokens in memory (in real app use a database)
let refreshTokens = []

// helper to generate tokens
const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: '15m' })

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET, { expiresIn: '7d' })

// REGISTER
app.post('/register', async (req, res) => {
  const { email, password } = req.body

  const existing = users.find((u) => u.email === email)
  if (existing) return res.status(400).json({ error: 'Email already registered' })

  const hashed = await bcrypt.hash(password, 10)
  const newUser = { id: users.length + 1, email, password: hashed }
  users.push(newUser)

  res.status(201).json({ message: 'User registered successfully' })
})

// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = users.find((u) => u.email === email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  refreshTokens.push(refreshToken) // save refresh token

  res.json({ accessToken, refreshToken })
})

// REFRESH — get new access token using refresh token
app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' })
  if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ error: 'Invalid refresh token' })

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Refresh token expired' })
    const newAccessToken = generateAccessToken(user)
    res.json({ accessToken: newAccessToken })
  })
})

// LOGOUT — invalidate refresh token
app.post('/logout', (req, res) => {
  const { refreshToken } = req.body
  refreshTokens = refreshTokens.filter((t) => t !== refreshToken)
  res.json({ message: 'Logged out' })
})

// PROTECTED ROUTE — only accessible with valid access token
app.get('/profile', (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!token) return res.status(401).json({ error: 'No token' })

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Access token expired or invalid' })
    res.json({ message: 'Welcome!', user })
  })
})

app.listen(5000, () => console.log('Server running on http://localhost:5000'))

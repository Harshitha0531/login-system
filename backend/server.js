import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import connectDB from './config/db.js'
import User from './models/User.js'
import Todo from './models/Todo.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))

connectDB()

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

// rate limiter — max 10 requests per 15 mins on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Please try again after 15 minutes.' }
})

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, ACCESS_SECRET, { expiresIn: '15m' })

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, REFRESH_SECRET, { expiresIn: '7d' })

// REGISTER
app.post('/register', authLimiter, async (req, res) => {
  const { email, password } = req.body

  // email format validation
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !validEmail.test(email))
    return res.status(400).json({ error: 'Invalid email format' })

  // password strength validation
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!strongPassword.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character.'
    })
  }

  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ error: 'Email already registered' })

  const hashed = await bcrypt.hash(password, 10)
  await User.create({ email, password: hashed })

  res.status(201).json({ message: 'User registered successfully' })
})

// LOGIN
app.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body

  // email format validation
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !validEmail.test(email))
    return res.status(400).json({ error: 'Invalid email format' })

  if (!password)
    return res.status(400).json({ error: 'Password is required' })

  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'This email is not registered' })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(401).json({ error: 'Incorrect password' })

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  // store refresh token in the user's document in MongoDB
  user.refreshToken = refreshToken
  await user.save()

  res.json({ accessToken, refreshToken })
})

// REFRESH
app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' })

  // check if refresh token exists in DB
  const user = await User.findOne({ refreshToken })
  if (!user) return res.status(403).json({ error: 'Invalid refresh token' })

  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Refresh token expired' })
    const newAccessToken = generateAccessToken(user)
    res.json({ accessToken: newAccessToken })
  })
})

// LOGOUT
app.post('/logout', async (req, res) => {
  const { refreshToken } = req.body
  // clear refresh token from user's document
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: null })
  res.json({ message: 'Logged out' })
})

// PROTECTED ROUTE
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Access token expired or invalid' })
    req.user = user
    next()
  })
}

app.get('/profile', authenticate, (req, res) => {
  res.json({ message: 'Welcome!', user: req.user })
})

// TODO ROUTES
app.get('/todos', authenticate, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(todos)
})

app.post('/todos', authenticate, async (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Text is required' })
  const todo = await Todo.create({ userId: req.user.id, text })
  res.status(201).json(todo)
})

app.patch('/todos/:id', authenticate, async (req, res) => {
  const updates = {}
  if (req.body.completed !== undefined) updates.completed = req.body.completed
  if (req.body.text) updates.text = req.body.text

  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    updates,
    { new: true }
  )
  res.json(todo)
})

app.delete('/todos/:id', authenticate, async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  res.json({ message: 'Deleted' })
})

app.listen(process.env.PORT || 5000, () => console.log(`Server running on http://localhost:${process.env.PORT || 5000}`))

const express = require('express')
const cors = require('cors')
require('colors')
require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')

connectDB()

const app = express()

const allowedOrigins = [
  'http://localhost:3000',
  'https://service-desk-eta.vercel.app',
]
const vercelPreviewOrigin = /^https:\/\/service-desk-[a-z0-9-]+-dwidy99s-projects\.vercel\.app$/i

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || vercelPreviewOrigin.test(origin)) {
        callback(null, true)
        return
      }

      callback(null, false)
    },
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))
app.use('/api/members', require('./routes/memberRoutes'))
app.use('/api/departments', require('./routes/departmentRoutes'))
app.use('/api/profile', require('./routes/profileRoutes'))

app.get('/', (_, res) => {
  res.status(200).json({ message: 'Welcome to the Service Desk API' })
})

app.use(errorHandler)

module.exports = app

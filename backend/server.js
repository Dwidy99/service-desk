const express = require('express')
const cors = require('cors')
require('colors')
require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

connectDB()

const app = express()

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://service-desk-eta.vercel.app'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))
app.use('/api/members', require('./routes/memberRoutes'))
app.use('/api/departments', require('./routes/departmentRoutes'))
app.use('/api/profile', require('./routes/profileRoutes'))

// Root route for backend health check
app.get('/', (_, res) => {
  res.status(200).json({ message: 'Welcome to the Service Desk API' })
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

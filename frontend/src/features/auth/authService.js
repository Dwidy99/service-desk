import axios from 'axios'

const API_URL = `${process.env.REACT_APP_API_URL}/api/users/`

const checkTokenExpiration = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    const expirationTime = user?.expirationTime
    const currentTime = new Date().getTime() / 1000 // Get current timestamp in seconds
    return expirationTime > currentTime
  }
  return false
}

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    const expirationTime = new Date().getTime() / 1000 + 86400 // Add 24 hours to current time (86400 seconds)
    const userDataWithExpiration = {
      ...response.data,
      expirationTime: expirationTime,
    }
    localStorage.setItem('user', JSON.stringify(userDataWithExpiration))
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

// If the token has expired, log the user out automatically
const autoLogout = () => {
  if (!checkTokenExpiration()) {
    logout()
  }
}

const authService = {
  register,
  logout,
  login,
  autoLogout,
}

export default authService

import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { email, password } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoading } = useSelector((state) => state.auth)

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password,
    }

    dispatch(login(userData))
      .unwrap()
      .then((user) => {
        toast.success(`Logged in as ${user.name}`)
        setIsRedirecting(true)
        navigate('/')
      })
      .catch((error) => {
        setIsRedirecting(false)
        toast.error(error)
      })
  }

  if (isLoading || isRedirecting) {
    return <Spinner />
  }

  return (
    <div className='min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center px-4 py-10'>
      <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-8'>
        <div className='text-center mb-8'>
          <div className='w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl'>
            <FaSignInAlt />
          </div>
          <h1 className='text-2xl font-bold text-gray-800'>Sign In</h1>
          <p className='text-gray-500 mt-2'>
            Log in to access your service desk account
          </p>
        </div>

        <form onSubmit={onSubmit} className='space-y-5'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={email}
              onChange={onChange}
              placeholder='Enter your email'
              required
              className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={password}
              onChange={onChange}
              placeholder='Enter your password'
              required
              className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading || isRedirecting}
            className='w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isLoading || isRedirecting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

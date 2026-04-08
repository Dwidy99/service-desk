import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { register } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, email, password, password2 } = formData

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

    if (password !== password2) {
      toast.error('Passwords do not match')
      return
    }

    const userData = {
      name,
      email,
      password,
    }

    dispatch(register(userData))
      .unwrap()
      .then((user) => {
        toast.success(`Registered new user - ${user.name}`)
        navigate('/')
      })
      .catch(toast.error)
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className='min-h-[calc(100vh-80px)] w-full bg-gray-50 flex items-center justify-center px-4 py-10'>
      <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-8'>
        <div className='text-center mb-8'>
          <div className='w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl'>
            <FaUser />
          </div>
          <h1 className='text-2xl font-bold text-gray-800'>Create Account</h1>
          <p className='text-gray-500 mt-2'>
            Register to manage your support requests
          </p>
        </div>

        <form onSubmit={onSubmit} className='space-y-5'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Full Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={name}
              onChange={onChange}
              placeholder='Enter your full name'
              required
              className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
            />
          </div>

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

          <div>
            <label
              htmlFor='password2'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Confirm Password
            </label>
            <input
              type='password'
              id='password2'
              name='password2'
              value={password2}
              onChange={onChange}
              placeholder='Confirm your password'
              required
              className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm'
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register

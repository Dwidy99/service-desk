import { FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useState, useRef, useEffect } from 'react'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef()

  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  // close dropdown kalau klik luar
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className='bg-white shadow-sm border-b'>
      <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='text-xl font-bold text-gray-800'>
          Service Desk
        </Link>

        {/* Menu */}
        <div className='flex items-center gap-4'>
          {user ? (
            <div className='relative' ref={dropdownRef}>
              {/* Avatar */}
              <button
                onClick={() => setOpen(!open)}
                className='flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition'
              >
                <div className='w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold'>
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className='text-left hidden md:block'>
                  <p className='text-sm font-medium text-gray-800'>
                    {user.name}
                  </p>
                  <p className='text-xs text-gray-500'>{user.email}</p>
                </div>
              </button>

              {/* Dropdown */}
              {open && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50'>
                  <Link
                    to='/profile'
                    onClick={() => setOpen(false)}
                    className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    <FaUser />
                    Profile
                  </Link>

                  <button
                    onClick={onLogout}
                    className='w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to='/login'
                className='flex items-center gap-2 text-gray-600 hover:text-blue-600 transition'
              >
                <FaSignInAlt />
                Login
              </Link>

              <Link
                to='/register'
                className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
              >
                <FaUser />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

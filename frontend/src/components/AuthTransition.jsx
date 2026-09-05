import { FaCheckCircle, FaCircleNotch, FaSignOutAlt } from 'react-icons/fa'

function AuthTransition({ type }) {
  const isLogout = type === 'logout'

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/30 px-4 backdrop-blur-sm'>
      <div className='w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl'>
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
            isLogout ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
          }`}
        >
          {isLogout ? (
            <FaSignOutAlt className='text-3xl' />
          ) : (
            <FaCheckCircle className='text-3xl' />
          )}
        </div>
        <h1 className='text-2xl font-bold text-gray-800'>
          {isLogout ? 'Logout successful' : 'Login successful'}
        </h1>
        <div className='mt-5 flex items-center justify-center gap-3'>
          <FaCircleNotch className='animate-spin text-xl text-blue-600' />
          <span className='font-medium text-gray-600'>
            {isLogout ? 'Returning to sign in...' : 'Opening your dashboard...'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AuthTransition

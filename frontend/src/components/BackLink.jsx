import { Link, useLocation } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

const BackLink = ({ to }) => {
  const location = useLocation()

  // Auto fallback logic
  const getDefaultRoute = () => {
    const path = location.pathname

    if (path.startsWith('/ticket')) return '/tickets'
    if (path.startsWith('/tickets')) return '/'
    if (path.startsWith('/create-member')) return '/members'
    if (path.startsWith('/members')) return '/'
    return '/'
  }

  const target = to || getDefaultRoute()

  return (
    <Link
      to={target}
      className='inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition'
    >
      <FaArrowLeft />
      Back
    </Link>
  )
}

export default BackLink

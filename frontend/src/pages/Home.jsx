import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FaQuestionCircle,
  FaTicketAlt,
  FaUsers,
  FaClock,
  FaUserPlus,
  FaBuilding,
} from 'react-icons/fa'
import { getTickets } from '../features/tickets/ticketSlice'
import { getDepartments } from '../features/departments/departmentSlice'
import { getMembers } from '../features/members/memberSlice'

function Home() {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'admin'

  const ticketState = useSelector((state) => state.tickets)
  const departmentState = useSelector((state) => state.departments)
  const memberState = useSelector((state) => state.members)

  const tickets = Array.isArray(ticketState?.tickets) ? ticketState.tickets : []
  const departments = Array.isArray(departmentState?.departments)
    ? departmentState.departments
    : []
  const members = Array.isArray(memberState?.members) ? memberState.members : []

  useEffect(() => {
    dispatch(getTickets())
    dispatch(getDepartments())

    if (isAdmin) {
      dispatch(getMembers())
    }
  }, [dispatch, isAdmin])

  const totalTickets = tickets.length
  const totalDepartments = departments.length
  const totalMembers = members.length

  const activeTickets = tickets.filter(
    (ticket) =>
      ticket.status === 'new' ||
      ticket.status === 'open' ||
      ticket.status === 'onHold'
  ).length

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === 'closed'
  ).length

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 leading-tight'>
            Service Desk Dashboard
          </h1>
          <p className='text-gray-500 mt-2 text-lg'>
            Monitor support requests and help desk activity
          </p>
        </div>

        <div
          className={`grid grid-cols-1 ${
            isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-3'
          } gap-6 mb-8`}
        >
          {isAdmin && (
            <div className='bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition'>
              <div className='w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl'>
                <FaUsers />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Total Members</p>
                <h2 className='text-2xl font-semibold text-gray-800'>
                  {totalMembers}
                </h2>
              </div>
            </div>
          )}

          <div className='bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition'>
            <div className='w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl'>
              <FaTicketAlt />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Total Tickets</p>
              <h2 className='text-2xl font-semibold text-gray-800'>
                {totalTickets}
              </h2>
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition'>
            <div className='w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-3xl'>
              <FaClock />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Active Tickets</p>
              <h2 className='text-2xl font-semibold text-gray-800'>
                {activeTickets}
              </h2>
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition'>
            <div className='w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl'>
              <FaBuilding />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Departments</p>
              <h2 className='text-2xl font-semibold text-gray-800'>
                {totalDepartments}
              </h2>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 ${
            isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-2'
          } gap-6 mb-8`}
        >
          <div className='bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition'>
            <p className='text-sm text-gray-500'>Closed Tickets</p>
            <h3 className='text-2xl font-semibold text-gray-800 mt-1'>
              {closedTickets}
            </h3>
          </div>

          <div className='bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition'>
            <p className='text-sm text-gray-500'>Open Ratio</p>
            <h3 className='text-2xl font-semibold text-gray-800 mt-1'>
              {totalTickets > 0
                ? `${Math.round((activeTickets / totalTickets) * 100)}%`
                : '0%'}
            </h3>
          </div>

          <div className='bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition'>
            <p className='text-sm text-gray-500'>Department Count</p>
            <h3 className='text-2xl font-semibold text-gray-800 mt-1'>
              {totalDepartments}
            </h3>
          </div>

          {isAdmin && (
            <div className='bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition'>
              <p className='text-sm text-gray-500'>Managed Members</p>
              <h3 className='text-2xl font-semibold text-gray-800 mt-1'>
                {totalMembers}
              </h3>
            </div>
          )}
        </div>

        <div
          className={`grid grid-cols-1 ${
            isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-2'
          } gap-6`}
        >
          <Link
            to='/new-ticket'
            className='bg-blue-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition'
          >
            <div className='bg-blue-100 text-blue-600 p-4 rounded-full mb-4 text-3xl'>
              <FaQuestionCircle />
            </div>
            <h2 className='text-lg font-semibold text-white'>Create Ticket</h2>
            <p className='text-white text-sm mt-1'>
              Submit a new support request
            </p>
          </Link>

          <Link
            to='/tickets'
            className='bg-green-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition'
          >
            <div className='bg-green-100 text-green-600 p-4 rounded-full mb-4 text-3xl'>
              <FaTicketAlt />
            </div>
            <h2 className='text-lg font-semibold text-white'>View Tickets</h2>
            <p className='text-white text-sm mt-1'>
              View and track all support tickets
            </p>
          </Link>

          {isAdmin && (
            <>
              <Link
                to='/members'
                className='bg-purple-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition'
              >
                <div className='bg-purple-100 text-purple-600 p-4 rounded-full mb-4 text-3xl'>
                  <FaUserPlus />
                </div>
                <h2 className='text-lg font-semibold text-white'>
                  Manage Members
                </h2>
                <p className='text-white text-sm mt-1'>
                  Add and manage service desk members
                </p>
              </Link>

              <Link
                to='/departments'
                className='bg-indigo-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition'
              >
                <div className='bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4 text-3xl'>
                  <FaBuilding />
                </div>
                <h2 className='text-lg font-semibold text-white'>
                  Manage Departments
                </h2>
                <p className='text-white text-sm mt-1'>
                  Create and organize support departments
                </p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home

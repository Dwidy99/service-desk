import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaTicketAlt } from 'react-icons/fa'
import { getTickets } from '../features/tickets/ticketSlice'
import Spinner from '../components/Spinner'
import TicketItem from '../components/TicketItem'
import BackLink from '../components/BackLink'

function Tickets() {
  const { tickets } = useSelector((state) => state.tickets)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTickets())
  }, [dispatch])

  if (!tickets) {
    return <Spinner />
  }

  return (
    <div className='min-h-[calc(100vh-80px)] w-full bg-gray-50 px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        <BackLink to='/' />

        <div className='mb-8 mt-4'>
          <h1 className='text-3xl font-bold text-gray-800'>My Tickets</h1>
          <p className='text-gray-500 mt-2'>
            Track and manage your support requests
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='flex items-center gap-3 px-6 py-5 border-b'>
            <div className='w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg'>
              <FaTicketAlt />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-gray-800'>
                Ticket List
              </h2>
              <p className='text-sm text-gray-500'>
                View all submitted support tickets
              </p>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div className='px-6 py-12 text-center'>
              <p className='text-gray-500'>No tickets found.</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <div className='min-w-full'>
                <div className='grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-semibold text-gray-600'>
                  <div>Date</div>
                  <div>Title</div>
                  <div>Department</div>
                  <div>Status</div>
                  <div className='text-right'>Action</div>
                </div>

                <div className='divide-y divide-gray-100'>
                  {tickets.map((ticket) => (
                    <TicketItem key={ticket._id} ticket={ticket} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tickets

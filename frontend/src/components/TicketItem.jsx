import { Link } from 'react-router-dom'

function TicketItem({ ticket }) {
  return (
    <div className='grid grid-cols-5 gap-4 px-6 py-4 items-center text-sm'>
      <div className='text-gray-500'>
        {new Date(ticket.createdAt).toLocaleDateString('en-US')}
      </div>

      <div className='font-medium text-gray-800 truncate'>{ticket.title}</div>

      <div className='text-gray-600'>{ticket.department?.name || '-'}</div>

      <div>
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            ticket.status === 'new'
              ? 'bg-blue-100 text-blue-700'
              : ticket.status === 'open'
                ? 'bg-yellow-100 text-yellow-700'
                : ticket.status === 'onHold'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-200 text-gray-700'
          }`}
        >
          {ticket.status}
        </span>
      </div>

      <div className='text-right'>
        <Link
          to={`/ticket/${ticket._id}`}
          className='inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition'
        >
          View
        </Link>
      </div>
    </div>
  )
}

export default TicketItem

import { useSelector } from 'react-redux'

function NoteItem({ note }) {
  const { user } = useSelector((state) => state.auth)

  const isCurrentUser = note.user?._id === user?._id

  return (
    <div
      className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-[75%] px-4 py-3 rounded-2xl shadow-sm border text-sm
          transition-all
          ${
            note.isStaff
              ? 'bg-blue-50 border-blue-200 text-blue-900'
              : 'bg-gray-50 border-gray-200 text-gray-800'
          }
          ${isCurrentUser ? 'rounded-br-sm' : 'rounded-bl-sm'}
        `}
      >
        {/* TEXT */}
        <p className='leading-relaxed whitespace-pre-line break-words text-[13px]'>
          {note.text}
        </p>

        {/* META */}
        <div className='mt-2 text-[11px] flex items-center justify-between gap-2 text-gray-400'>
          <span className='flex items-center gap-1'>
            {note.user?.name || 'Unknown'}

            {/* Badge role */}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                note.isStaff
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {note.isStaff ? 'Admin' : 'Member'}
            </span>
          </span>

          <span>
            {note.createdAt
              ? new Date(note.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default NoteItem

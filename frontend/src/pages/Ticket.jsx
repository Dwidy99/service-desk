import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { FaPlus, FaTimes, FaStickyNote } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import {
  getTicket,
  updateTicketStatus,
  assignDepartment,
} from '../features/tickets/ticketSlice'
import { getNotes, createNote } from '../features/notes/noteSlice'
import { useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'
import BackLink from '../components/BackLink'
import { getDepartments } from '../features/departments/departmentSlice'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    zIndex: 50,
  },
  content: {
    maxWidth: '640px',
    width: '90%',
    inset: '50% auto auto 50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    borderRadius: '16px',
    padding: '0',
    overflow: 'hidden',
  },
}

Modal.setAppElement('#root')

function Ticket() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [firstResponseText, setFirstResponseText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const { ticket } = useSelector((state) => state.tickets)
  const { notes } = useSelector((state) => state.notes)
  const { user } = useSelector((state) => state.auth)
  const { departments = [] } = useSelector((state) => state.departments)

  const dispatch = useDispatch()
  const { ticketId } = useParams()

  useEffect(() => {
    dispatch(getTicket(ticketId)).unwrap().catch(toast.error)
    dispatch(getNotes(ticketId)).unwrap().catch(toast.error)
    dispatch(getDepartments()).unwrap().catch(toast.error)
  }, [ticketId, dispatch])

  useEffect(() => {
    if (ticket?.status) {
      setSelectedStatus(ticket.status)
    }

    if (ticket?.department?._id) {
      setSelectedDepartment(ticket.department._id)
    }
  }, [ticket])

  const isAdmin = user?.role === 'admin'
  const statusOptions = ['new', 'open', 'onHold', 'closed']

  const userFirstResponse = useMemo(() => {
    if (!notes || !user?._id) return null
    return notes.find((note) => note.user?._id === user._id) || null
  }, [notes, user])

  const onStatusUpdate = () => {
    if (!selectedStatus || selectedStatus === ticket.status) return

    dispatch(updateTicketStatus({ ticketId, status: selectedStatus }))
      .unwrap()
      .then(() => {
        toast.success('Ticket status updated')
      })
      .catch(toast.error)
  }

  const onDepartmentUpdate = () => {
    if (!selectedDepartment || selectedDepartment === ticket.department?._id) {
      return
    }

    dispatch(
      assignDepartment({
        ticketId,
        departmentId: selectedDepartment,
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Department updated')
      })
      .catch(toast.error)
  }

  const onNoteSubmit = (e) => {
    e.preventDefault()

    if (!noteText.trim()) {
      toast.error('Please write a note')
      return
    }

    dispatch(createNote({ noteText, ticketId }))
      .unwrap()
      .then(() => {
        setNoteText('')
        closeModal()
        toast.success('Note added')
      })
      .catch(toast.error)
  }

  const onFirstResponseSubmit = (e) => {
    e.preventDefault()

    if (!firstResponseText.trim()) {
      toast.error('Please write your first response')
      return
    }

    dispatch(createNote({ noteText: firstResponseText, ticketId }))
      .unwrap()
      .then(() => {
        setFirstResponseText('')
        toast.success('First response submitted')
      })
      .catch(toast.error)
  }

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (!ticket) {
    return <Spinner />
  }

  const statusStyles = {
    new: 'bg-green-100 text-green-700',
    open: 'bg-blue-100 text-blue-700',
    onHold: 'bg-yellow-100 text-yellow-700',
    closed: 'bg-gray-200 text-gray-700',
  }

  return (
    <div className='min-h-[calc(100vh-80px)] w-full bg-gray-50 px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <BackLink to='/tickets' />

        <div className='mb-8 mt-4'>
          <h1 className='text-3xl font-bold text-gray-800'>Ticket Details</h1>
          <p className='text-gray-500 mt-2'>
            Review the issue, manage notes, and track the request
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6'>
          <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
            <div>
              <h2 className='text-xl font-semibold text-gray-800'>
                Ticket ID: {ticket._id.slice(-6).toUpperCase()}
              </h2>
              <p className='text-sm text-gray-500 mt-2'>
                Date Submitted:{' '}
                {new Date(ticket.createdAt).toLocaleString('en-US')}
              </p>
              <p className='text-sm text-gray-500 mt-1'>
                Title: {ticket.title}
              </p>
              <p className='text-sm text-gray-500 mt-1'>
                Department: {ticket.department?.name || '-'}
              </p>
            </div>

            <span
              className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-medium ${
                statusStyles[ticket.status] || 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {ticket.status}
            </span>
          </div>

          <div className='mt-6 border-t pt-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              Description of Issue
            </h3>
            <p className='text-gray-600 leading-7 bg-gray-50 rounded-xl border border-gray-100 p-4'>
              {ticket.description}
            </p>
          </div>

          {isAdmin && (
            <div className='mt-6 border-t pt-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                Change Department
              </h3>

              <div className='grid md:grid-cols-[1fr_auto] gap-3'>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                >
                  <option value=''>Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={onDepartmentUpdate}
                  disabled={selectedDepartment === ticket.department?._id}
                  className='rounded-xl bg-purple-600 px-5 py-3 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Submit
                </button>
              </div>

              <p className='text-xs text-gray-500 mt-2'>
                Only admin can change ticket department.
              </p>
            </div>
          )}

          {isAdmin ? (
            <div className='mt-6 border-t pt-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                Update Status
              </h3>

              <div className='grid md:grid-cols-[1fr_auto] gap-3'>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500'
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === 'onHold'
                        ? 'On Hold'
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={onStatusUpdate}
                  disabled={selectedStatus === ticket.status}
                  className='rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Submit
                </button>
              </div>

              <p className='text-xs text-gray-500 mt-2'>
                Admin can manage all ticket statuses.
              </p>
            </div>
          ) : (
            <div className='mt-6 border-t pt-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                First Response
              </h3>

              {userFirstResponse ? (
                <div className='rounded-xl border border-green-200 bg-green-50 px-4 py-3'>
                  <p className='text-sm font-medium text-green-700'>
                    First response already submitted
                  </p>
                  <p className='text-sm text-green-600 mt-1 whitespace-pre-line break-words'>
                    {userFirstResponse.text}
                  </p>
                </div>
              ) : (
                <form onSubmit={onFirstResponseSubmit} className='space-y-3'>
                  <textarea
                    rows='4'
                    value={firstResponseText}
                    onChange={(e) => setFirstResponseText(e.target.value)}
                    placeholder='Write your first response here...'
                    className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none'
                  />

                  <button
                    type='submit'
                    className='rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition'
                  >
                    Submit First Response
                  </button>
                </form>
              )}

              <p className='text-xs text-gray-500 mt-2'>
                Member can only submit the first response, not change ticket
                status.
              </p>
            </div>
          )}
        </div>

        <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className='w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg'>
                <FaStickyNote />
              </div>
              <div>
                <h2 className='text-lg font-semibold text-gray-800'>Notes</h2>
                <p className='text-sm text-gray-500'>
                  Add internal notes related to this support request
                </p>
              </div>
            </div>

            {isAdmin && ticket.status !== 'closed' && (
              <button
                onClick={openModal}
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition shadow-sm'
              >
                <FaPlus />
                Add Note
              </button>
            )}
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel='Add Note'
          >
            <div className='bg-white'>
              <div className='flex items-center justify-between px-6 py-5 border-b'>
                <div>
                  <h2 className='text-lg font-semibold text-gray-800'>
                    Add Note
                  </h2>
                  <p className='text-sm text-gray-500'>
                    Write additional information for this ticket
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className='w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 flex items-center justify-center transition'
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={onNoteSubmit} className='p-6 space-y-5'>
                <div>
                  <label
                    htmlFor='noteText'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Note
                  </label>
                  <textarea
                    name='noteText'
                    id='noteText'
                    rows='5'
                    placeholder='Write your note here...'
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none'
                  ></textarea>
                </div>

                <button
                  type='submit'
                  className='w-full rounded-xl bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition shadow-sm'
                >
                  Submit Note
                </button>
              </form>
            </div>
          </Modal>

          <div className='space-y-4'>
            {notes ? (
              notes.length > 0 ? (
                notes.map((note) => <NoteItem key={note._id} note={note} />)
              ) : (
                <div className='text-center py-10 text-gray-500'>
                  No notes available for this ticket.
                </div>
              )
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ticket

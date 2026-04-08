import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaTicketAlt, FaBuilding, FaArrowLeft, FaHeading } from 'react-icons/fa'
import { createTicket } from '../features/tickets/ticketSlice'
import { getDepartments } from '../features/departments/departmentSlice'

function NewTicket() {
  const { user } = useSelector((state) => state.auth)
  const { departments = [], isLoading } = useSelector(
    (state) => state.departments
  )

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getDepartments()).unwrap().catch(toast.error)
  }, [dispatch])

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const { title, department, description } = formData

    if (!title.trim() || !department || !description.trim()) {
      toast.error('Please complete title, department, and description')
      return
    }

    setIsSubmitting(true)

    dispatch(
      createTicket({
        title: title.trim(),
        department,
        description: description.trim(),
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Ticket created successfully 🎉')
        navigate('/tickets')
      })
      .catch((err) => {
        toast.error(err || 'Failed to create ticket')
      })
      .finally(() => setIsSubmitting(false))
  }

  return (
    <div className='min-h-[calc(100vh-80px)] w-full bg-gray-50 px-4 py-8'>
      <div className='max-w-3xl mx-auto'>
        {/* BACK */}
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition'
        >
          <FaArrowLeft />
          Back
        </Link>

        {/* HEADER */}
        <div className='mb-8 mt-4'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Create New Ticket
          </h1>
          <p className='text-gray-500 mt-2'>
            Submit a request and it will be handled by your admin
          </p>
        </div>

        {/* CARD */}
        <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl'>
              <FaTicketAlt />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-800'>
                Support Request
              </h2>
              <p className='text-sm text-gray-500'>
                Fill the form clearly to get faster help
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className='space-y-5'>
            {/* TITLE */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ticket Title
              </label>
              <div className='relative'>
                <FaHeading className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={onChange}
                  placeholder='Example: Cannot login to system'
                  className='w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            {/* DEPARTMENT */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Department
              </label>

              <div className='relative'>
                <FaBuilding className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />

                <select
                  name='department'
                  value={formData.department}
                  onChange={onChange}
                  disabled={isLoading}
                  className='w-full appearance-none rounded-xl border border-gray-200 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>
                    {isLoading ? 'Loading departments...' : 'Select Department'}
                  </option>

                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* UX tambahan */}
              <p className='text-xs text-gray-400 mt-1'>
                Choose the correct department for faster response
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description
              </label>
              <textarea
                name='description'
                rows='5'
                value={formData.description}
                onChange={onChange}
                placeholder='Explain your issue in detail...'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              />
            </div>

            {/* BUTTON */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50'
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewTicket

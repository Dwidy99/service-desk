import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaBuilding, FaInfoCircle, FaSave } from 'react-icons/fa'
import { createDepartment } from '../features/departments/departmentSlice'
import BackLink from '../components/BackLink'

function CreateDepartment() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user?.role !== 'admin') {
    return <Navigate to='/' replace />
  }

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Department name is required')
      return
    }

    setIsSubmitting(true)

    dispatch(
      createDepartment({
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Department created successfully')
        navigate('/departments')
      })
      .catch(toast.error)
      .finally(() => setIsSubmitting(false))
  }

  return (
    <div className='min-h-screen bg-slate-50 px-4 py-8 md:px-6'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-5'>
          <BackLink to='/departments' />
        </div>

        <div className='mb-8'>
          <div className='flex items-start gap-4'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm'>
              <FaBuilding className='text-lg' />
            </div>

            <div>
              <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
                Create Department
              </h1>
              <p className='mt-2 max-w-2xl text-sm text-slate-500'>
                Add a new department to organize support tickets and assign
                members more clearly.
              </p>
            </div>
          </div>
        </div>

        <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
          <div className='border-b border-slate-200 px-6 py-5'>
            <h2 className='text-lg font-semibold text-slate-900'>
              Department Information
            </h2>
            <p className='mt-1 text-sm text-slate-500'>
              Fill in the main details below before saving.
            </p>
          </div>

          <form onSubmit={onSubmit} className='space-y-6 px-6 py-6'>
            <div>
              <label
                htmlFor='name'
                className='mb-2 block text-sm font-medium text-slate-700'
              >
                Department Name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                value={formData.name}
                onChange={onChange}
                placeholder='Example: IT Support'
                className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              />
              <p className='mt-2 text-xs text-slate-500'>
                Use a short and clear department name.
              </p>
            </div>

            <div>
              <label
                htmlFor='description'
                className='mb-2 block text-sm font-medium text-slate-700'
              >
                Description
              </label>
              <textarea
                id='description'
                name='description'
                rows='4'
                value={formData.description}
                onChange={onChange}
                placeholder='Write a short description about this department'
                className='w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              />
              <div className='mt-2 flex items-start gap-2 text-xs text-slate-500'>
                <FaInfoCircle className='mt-0.5 shrink-0' />
                <p>
                  Optional. You can explain the department role, team scope, or
                  service responsibility.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor='status'
                className='mb-2 block text-sm font-medium text-slate-700'
              >
                Status
              </label>
              <select
                id='status'
                name='status'
                value={formData.status}
                onChange={onChange}
                className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              >
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
              <p className='mt-2 text-xs text-slate-500'>
                Active departments can be used immediately in the system.
              </p>
            </div>

            <div className='rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4'>
              <p className='text-sm font-medium text-blue-900'>Quick Preview</p>
              <div className='mt-3 grid gap-3 sm:grid-cols-2'>
                <div className='rounded-xl bg-white px-4 py-3'>
                  <p className='text-xs text-slate-500'>Department Name</p>
                  <p className='mt-1 font-semibold text-slate-900'>
                    {formData.name.trim() || 'Not filled yet'}
                  </p>
                </div>

                <div className='rounded-xl bg-white px-4 py-3'>
                  <p className='text-xs text-slate-500'>Status</p>
                  <p className='mt-1 font-semibold capitalize text-slate-900'>
                    {formData.status}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row'>
              <button
                type='button'
                onClick={() => navigate('/departments')}
                disabled={isSubmitting}
                className='w-full rounded-2xl border border-slate-200 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Cancel
              </button>

              <button
                type='submit'
                disabled={isSubmitting}
                className='inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <FaSave className='text-sm' />
                {isSubmitting ? 'Creating...' : 'Create Department'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateDepartment

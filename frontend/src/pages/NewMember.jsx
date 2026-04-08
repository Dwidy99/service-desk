import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createMember } from '../features/members/memberSlice'
import { getDepartments } from '../features/departments/departmentSlice'
import BackLink from '../components/BackLink'
import { FaUser, FaEnvelope, FaPhone, FaLock, FaBuilding } from 'react-icons/fa'

function CreateMember() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { departments = [] } = useSelector((state) => state.departments)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    description: '',
    status: 'active',
  })

  useEffect(() => {
    dispatch(getDepartments()).unwrap().catch(toast.error)
  }, [dispatch])

  // 🔐 PROTECT ADMIN
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

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Name, email, and password are required')
      return
    }

    setIsSubmitting(true)

    dispatch(createMember(formData))
      .unwrap()
      .then(() => {
        toast.success('Member created successfully 🎉')
        navigate('/members')
      })
      .catch(toast.error)
      .finally(() => setIsSubmitting(false))
  }

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-4xl mx-auto'>
        <BackLink to='/members' />

        {/* CARD */}
        <div className='bg-white p-8 rounded-2xl shadow-lg mt-4'>
          {/* HEADER */}
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800'>
              Create New Member
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Add a new team member and assign department
            </p>
          </div>

          <form onSubmit={onSubmit} className='space-y-6'>
            {/* ROW 1 */}
            <div className='grid md:grid-cols-2 gap-5'>
              <InputField
                icon={<FaUser />}
                name='name'
                placeholder='Full Name'
                value={formData.name}
                onChange={onChange}
              />

              <InputField
                icon={<FaEnvelope />}
                name='email'
                placeholder='Email Address'
                value={formData.email}
                onChange={onChange}
              />
            </div>

            {/* ROW 2 */}
            <div className='grid md:grid-cols-2 gap-5'>
              <InputField
                icon={<FaLock />}
                name='password'
                type='password'
                placeholder='Temporary Password'
                value={formData.password}
                onChange={onChange}
              />

              <InputField
                icon={<FaPhone />}
                name='phone'
                placeholder='Phone Number'
                value={formData.phone}
                onChange={onChange}
              />
            </div>

            {/* ROW 3 */}
            <div className='grid md:grid-cols-2 gap-5'>
              {/* DEPARTMENT */}
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Department
                </label>
                <div className='relative'>
                  <FaBuilding className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />

                  <select
                    name='department'
                    value={formData.department}
                    onChange={onChange}
                    className='w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value=''>Select Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Status
                </label>
                <select
                  name='status'
                  value={formData.status}
                  onChange={onChange}
                  className='w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                Description
              </label>
              <textarea
                name='description'
                rows='4'
                value={formData.description}
                onChange={onChange}
                placeholder='Optional notes about this member'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              />
            </div>

            {/* BUTTON */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50'
            >
              {isSubmitting ? 'Creating...' : 'Create Member'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateMember

// 🔥 reusable input component
function InputField({
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
}) {
  return (
    <div>
      <label className='text-sm font-medium text-gray-700 mb-2 block'>
        {placeholder}
      </label>
      <div className='relative'>
        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
    </div>
  )
}

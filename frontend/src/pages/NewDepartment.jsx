import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createDepartment } from '../features/departments/departmentSlice'
import BackLink from '../components/BackLink'

function CreateDepartment() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  })

  const { user } = useSelector((state) => state.auth)

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

    if (!formData.name) {
      toast.error('Name required')
      return
    }

    dispatch(createDepartment(formData))
      .unwrap()
      .then(() => {
        toast.success('Department created')
        navigate('/departments')
      })
      .catch(toast.error)
  }

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-2xl mx-auto'>
        <BackLink to='/departments' />

        <div className='bg-white p-8 rounded-2xl shadow mt-4'>
          <h2 className='text-xl font-semibold mb-6'>Create Department</h2>

          <form onSubmit={onSubmit} className='space-y-5'>
            <input
              name='name'
              placeholder='Department Name'
              onChange={onChange}
              className='input'
            />

            <textarea
              name='description'
              placeholder='Description'
              onChange={onChange}
              className='input'
            />

            <select name='status' onChange={onChange} className='input'>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>

            <button className='btn-primary w-full'>Create Department</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateDepartment

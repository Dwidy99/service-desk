import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPlus } from 'react-icons/fa'
import { toast } from 'react-toastify'
import BackLink from '../components/BackLink'
import {
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from '../features/departments/departmentSlice'

function Department() {
  const dispatch = useDispatch()

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const departmentState = useSelector((state) => state.departments)
  const departments = departmentState?.departments || []
  const isLoading = departmentState?.isLoading || false

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  })

  useEffect(() => {
    dispatch(getDepartments()).unwrap().catch(toast.error)
  }, [dispatch])

  const { user } = useSelector((state) => state.auth)

  if (user?.role !== 'admin') {
    return <Navigate to='/' replace />
  }

  const openEditModal = (department) => {
    setSelectedDepartment(department)
    setFormData({
      name: department.name || '',
      description: department.description || '',
      status: department.status || 'active',
    })
    setIsEditOpen(true)
  }

  const closeEditModal = () => {
    setIsEditOpen(false)
    setSelectedDepartment(null)
    setFormData({
      name: '',
      description: '',
      status: 'active',
    })
  }

  const openDeleteModal = (department) => {
    setDeleteTarget(department)
    setIsDeleteOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteTarget(null)
    setIsDeleteOpen(false)
  }

  const confirmDelete = () => {
    setIsSubmitting(true)

    dispatch(deleteDepartment(deleteTarget._id))
      .unwrap()
      .then(() => {
        toast.success('Department deleted successfully', { icon: '🗑️' })
        closeDeleteModal()
      })
      .catch(toast.error)
      .finally(() => setIsSubmitting(false))
  }

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmitEdit = (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Department name is required', { icon: '⚠️' })
      return
    }

    setIsSubmitting(true)

    dispatch(
      updateDepartment({
        id: selectedDepartment._id,
        departmentData: {
          name: formData.name.trim(),
          description: formData.description.trim(),
          status: formData.status,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Department updated successfully', { icon: '✅' })
        closeEditModal()
      })
      .catch(toast.error)
      .finally(() => setIsSubmitting(false))
  }

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-4'>
          <BackLink to='/' />
        </div>

        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-xl font-semibold text-gray-800'>Departments</h2>
            <p className='text-sm text-gray-500 mt-1'>
              Manage departments for users and tickets
            </p>
          </div>

          <Link
            to='/create-department'
            className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm'
          >
            <FaPlus />
            Add Department
          </Link>
        </div>

        <div className='bg-white rounded-2xl shadow-md overflow-hidden'>
          <div className='grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-semibold text-gray-600 text-center'>
            <div>Name</div>
            <div>Description</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {isLoading ? (
            <div className='px-6 py-12 text-center text-gray-500'>
              Loading departments...
            </div>
          ) : departments.length === 0 ? (
            <div className='px-6 py-12 text-center text-gray-500'>
              No departments found.
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {departments.map((department) => (
                <div
                  key={department._id}
                  className='grid grid-cols-4 gap-4 px-6 py-4 items-center text-sm text-center'
                >
                  <div className='font-medium text-gray-800'>
                    {department.name}
                  </div>

                  <div className='text-gray-600'>
                    {department.description || '-'}
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        department.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {department.status}
                    </span>
                  </div>

                  <div className='flex justify-center gap-2'>
                    <button
                      onClick={() => openEditModal(department)}
                      className='px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(department)}
                      className='px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isEditOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity duration-200'>
          <div className='w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-200 scale-100 opacity-100'>
            <div className='flex items-center justify-between px-6 py-5 border-b'>
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Edit Department
                </h3>
                <p className='text-sm text-gray-500 mt-1'>
                  Update department information
                </p>
              </div>
            </div>

            <form onSubmit={onSubmitEdit} className='p-6 space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Department Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={onChange}
                  placeholder='Enter department name'
                  className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Description
                </label>
                <textarea
                  name='description'
                  rows='4'
                  value={formData.description}
                  onChange={onChange}
                  placeholder='Optional department description'
                  className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Status
                </label>
                <select
                  name='status'
                  value={formData.status}
                  onChange={onChange}
                  className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                >
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>

              <div className='flex gap-3 pt-2'>
                <button
                  type='button'
                  onClick={closeEditModal}
                  disabled={isSubmitting}
                  className='w-full rounded-xl border border-gray-200 py-3 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full rounded-xl bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity duration-200'>
          <div className='w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-200 scale-100 opacity-100'>
            {/* Header */}
            <div className='px-6 py-5 border-b'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Delete Department
              </h3>
              <p className='text-sm text-gray-500 mt-1'>
                This action cannot be undone
              </p>
            </div>

            {/* Content */}
            <div className='px-6 py-5 text-center'>
              <p className='text-gray-700'>Are you sure you want to delete</p>
              <p className='font-semibold text-gray-900 mt-1'>
                {deleteTarget?.name}?
              </p>
            </div>

            {/* Actions */}
            <div className='flex gap-3 px-6 pb-6'>
              <button
                onClick={closeDeleteModal}
                disabled={isSubmitting}
                className='w-full rounded-xl border border-gray-200 py-3 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className='w-full rounded-xl bg-red-600 py-3 text-white font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Department

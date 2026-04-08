import { Link, Navigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FaPlus,
  FaBuilding,
  FaCheckCircle,
  FaBan,
  FaEdit,
  FaTrash,
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import BackLink from '../components/BackLink'
import {
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from '../features/departments/departmentSlice'

function Department() {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const departmentState = useSelector((state) => state.departments)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  })

  const departments = useMemo(() => {
    return Array.isArray(departmentState?.departments)
      ? departmentState.departments
      : []
  }, [departmentState?.departments])

  const isLoading = departmentState?.isLoading || false

  const totalDepartments = departments.length

  const activeDepartments = useMemo(() => {
    return departments.filter((dept) => dept.status === 'active').length
  }, [departments])

  const inactiveDepartments = useMemo(() => {
    return departments.filter((dept) => dept.status === 'inactive').length
  }, [departments])

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(getDepartments()).unwrap().catch(toast.error)
    }
  }, [dispatch, user])

  if (user?.role !== 'admin') {
    return <Navigate to='/' replace />
  }

  const openEditModal = (department) => {
    setSelectedDepartment(department)
    setFormData({
      name: department?.name || '',
      description: department?.description || '',
      status: department?.status || 'active',
    })
    setIsEditOpen(true)
  }

  const closeEditModal = () => {
    setSelectedDepartment(null)
    setFormData({
      name: '',
      description: '',
      status: 'active',
    })
    setIsEditOpen(false)
  }

  const openDeleteModal = (department) => {
    setDeleteTarget(department)
    setIsDeleteOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteTarget(null)
    setIsDeleteOpen(false)
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

    if (!selectedDepartment?._id) return

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

  const confirmDelete = () => {
    if (!deleteTarget?._id) return

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

  return (
    <div className='min-h-screen bg-slate-50 px-4 py-8 md:px-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-5'>
          <BackLink to='/' />
        </div>

        <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
              Department Management
            </h1>
            <p className='mt-2 text-sm text-slate-500'>
              Manage departments used for ticket routing and member assignment.
            </p>
          </div>

          <Link
            to='/create-department'
            className='inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700'
          >
            <FaPlus className='text-xs' />
            Add Department
          </Link>
        </div>

        <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600'>
                <FaBuilding />
              </div>
              <div>
                <p className='text-sm text-slate-500'>Total Departments</p>
                <h3 className='text-2xl font-bold text-slate-900'>
                  {totalDepartments}
                </h3>
              </div>
            </div>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600'>
                <FaCheckCircle />
              </div>
              <div>
                <p className='text-sm text-slate-500'>Active</p>
                <h3 className='text-2xl font-bold text-slate-900'>
                  {activeDepartments}
                </h3>
              </div>
            </div>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600'>
                <FaBan />
              </div>
              <div>
                <p className='text-sm text-slate-500'>Inactive</p>
                <h3 className='text-2xl font-bold text-slate-900'>
                  {inactiveDepartments}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
          <div className='border-b border-slate-200 px-6 py-5'>
            <h2 className='text-lg font-semibold text-slate-900'>
              Department List
            </h2>
            <p className='mt-1 text-sm text-slate-500'>
              Edit department details or remove departments you no longer use.
            </p>
          </div>

          {isLoading ? (
            <div className='px-6 py-16 text-center'>
              <div className='mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600' />
              <p className='text-sm text-slate-500'>Loading departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <div className='px-6 py-16 text-center'>
              <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400'>
                <FaBuilding />
              </div>
              <h3 className='text-lg font-semibold text-slate-800'>
                No departments found
              </h3>
              <p className='mt-2 text-sm text-slate-500'>
                Start by creating your first department.
              </p>
              <Link
                to='/create-department'
                className='mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700'
              >
                <FaPlus className='text-xs' />
                Create Department
              </Link>
            </div>
          ) : (
            <>
              <div className='hidden grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-600 md:grid'>
                <div className='col-span-3'>Department</div>
                <div className='col-span-5'>Description</div>
                <div className='col-span-2'>Status</div>
                <div className='col-span-2 text-right'>Actions</div>
              </div>

              <div className='divide-y divide-slate-100'>
                {departments.map((department) => (
                  <div
                    key={department._id}
                    className='px-5 py-5 md:px-6 md:py-4'
                  >
                    <div className='hidden items-center gap-4 md:grid md:grid-cols-12'>
                      <div className='col-span-3'>
                        <p className='font-semibold text-slate-900'>
                          {department.name}
                        </p>
                      </div>

                      <div className='col-span-5'>
                        <p className='line-clamp-2 text-sm text-slate-600'>
                          {department.description || 'No description provided'}
                        </p>
                      </div>

                      <div className='col-span-2'>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            department.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {department.status}
                        </span>
                      </div>

                      <div className='col-span-2 flex justify-end gap-2'>
                        <button
                          onClick={() => openEditModal(department)}
                          className='inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50'
                        >
                          <FaEdit className='text-xs' />
                          Edit
                        </button>

                        <button
                          onClick={() => openDeleteModal(department)}
                          className='inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50'
                        >
                          <FaTrash className='text-xs' />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className='rounded-2xl border border-slate-200 p-4 md:hidden'>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <h3 className='font-semibold text-slate-900'>
                            {department.name}
                          </h3>
                          <p className='mt-1 text-sm text-slate-600'>
                            {department.description ||
                              'No description provided'}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            department.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {department.status}
                        </span>
                      </div>

                      <div className='mt-4 flex gap-2'>
                        <button
                          onClick={() => openEditModal(department)}
                          className='flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50'
                        >
                          <FaEdit className='text-xs' />
                          Edit
                        </button>

                        <button
                          onClick={() => openDeleteModal(department)}
                          className='flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50'
                        >
                          <FaTrash className='text-xs' />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {isEditOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6'>
          <div className='w-full max-w-lg rounded-3xl bg-white shadow-2xl'>
            <div className='border-b border-slate-200 px-6 py-5'>
              <h3 className='text-xl font-semibold text-slate-900'>
                Edit Department
              </h3>
              <p className='mt-1 text-sm text-slate-500'>
                Update department details and availability.
              </p>
            </div>

            <form onSubmit={onSubmitEdit} className='space-y-5 px-6 py-6'>
              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700'>
                  Department Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={onChange}
                  placeholder='Enter department name'
                  className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700'>
                  Description
                </label>
                <textarea
                  name='description'
                  rows='4'
                  value={formData.description}
                  onChange={onChange}
                  placeholder='Optional department description'
                  className='w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700'>
                  Status
                </label>
                <select
                  name='status'
                  value={formData.status}
                  onChange={onChange}
                  className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                >
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>

              <div className='flex flex-col-reverse gap-3 pt-2 sm:flex-row'>
                <button
                  type='button'
                  onClick={closeEditModal}
                  disabled={isSubmitting}
                  className='w-full rounded-2xl border border-slate-200 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full rounded-2xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6'>
          <div className='w-full max-w-md rounded-3xl bg-white shadow-2xl'>
            <div className='border-b border-slate-200 px-6 py-5'>
              <h3 className='text-xl font-semibold text-slate-900'>
                Delete Department
              </h3>
              <p className='mt-1 text-sm text-slate-500'>
                This action cannot be undone.
              </p>
            </div>

            <div className='px-6 py-6 text-center'>
              <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600'>
                <FaTrash />
              </div>
              <p className='text-slate-700'>Are you sure you want to delete</p>
              <p className='mt-1 font-semibold text-slate-900'>
                {deleteTarget?.name}?
              </p>
            </div>

            <div className='flex flex-col-reverse gap-3 px-6 pb-6 sm:flex-row'>
              <button
                onClick={closeDeleteModal}
                disabled={isSubmitting}
                className='w-full rounded-2xl border border-slate-200 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className='w-full rounded-2xl bg-rose-600 py-3 font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isSubmitting ? 'Deleting...' : 'Delete Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Department

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  getMembers,
  deleteMember,
  updateMember,
} from '../features/members/memberSlice'
import { getDepartments } from '../features/departments/departmentSlice'
import { Link, Navigate } from 'react-router-dom'
import { FaUserPlus, FaTimes } from 'react-icons/fa'
import BackLink from '../components/BackLink'

function Members() {
  const dispatch = useDispatch()

  const memberState = useSelector((state) => state.members)
  const members = memberState?.members || []
  const isLoading = memberState?.isLoading || false

  const departmentState = useSelector((state) => state.departments)
  const departments = departmentState?.departments || []

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    description: '',
    status: 'active',
  })

  useEffect(() => {
    dispatch(getMembers()).unwrap().catch(toast.error)
    dispatch(getDepartments()).unwrap().catch(toast.error)
  }, [dispatch])

  const { user } = useSelector((state) => state.auth)

  if (user?.role !== 'admin') {
    return <Navigate to='/' replace />
  }

  const openEditModal = (member) => {
    setSelectedMember(member)
    setFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      department: member.department?._id || '',
      description: member.description || '',
      status: member.status || 'active',
    })
    setIsEditOpen(true)
  }

  const closeEditModal = () => {
    setIsEditOpen(false)
    setSelectedMember(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      description: '',
      status: 'active',
    })
  }

  const openDeleteModal = (member) => {
    setDeleteTarget(member)
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

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required', { icon: '⚠️' })
      return
    }

    setIsSubmitting(true)

    dispatch(
      updateMember({
        id: selectedMember._id,
        memberData: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          department: formData.department || null,
          description: formData.description.trim(),
          status: formData.status,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Member updated successfully', { icon: '✅' })
        closeEditModal()
      })
      .catch(toast.error)
      .finally(() => setIsSubmitting(false))
  }

  const confirmDelete = () => {
    setIsSubmitting(true)

    dispatch(deleteMember(deleteTarget._id))
      .unwrap()
      .then(() => {
        toast.success('Member deleted', { icon: '🗑️' })
        closeDeleteModal()
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
            <h2 className='text-xl font-semibold text-gray-800'>Members</h2>
            <p className='text-sm text-gray-500 mt-1'>
              Manage all members created by admin
            </p>
          </div>

          <Link
            to='/create-member'
            className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm'
          >
            <FaUserPlus />
            Add Member
          </Link>
        </div>

        <div className='bg-white rounded-2xl shadow-md overflow-hidden'>
          <div className='grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-semibold text-gray-600 text-center'>
            <div>Name</div>
            <div>Email</div>
            <div>Department</div>
            <div>Status</div>
            <div>Created</div>
            <div>Action</div>
          </div>

          {isLoading ? (
            <div className='px-6 py-12 text-center text-gray-500'>
              Loading members...
            </div>
          ) : members.length === 0 ? (
            <div className='px-6 py-12 text-center text-gray-500'>
              No members found.
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {members.map((member) => (
                <div
                  key={member._id}
                  className='grid grid-cols-6 gap-4 px-6 py-4 items-center text-sm text-center'
                >
                  <div className='font-medium text-gray-800'>{member.name}</div>
                  <div className='text-gray-600'>{member.email}</div>
                  <div className='text-gray-600'>
                    {member.department?.name || '-'}
                  </div>
                  <div className='flex justify-center'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                  <div className='text-gray-500'>
                    {new Date(member.createdAt).toLocaleDateString('en-US')}
                  </div>
                  <div className='flex justify-center gap-2'>
                    <button
                      onClick={() => openEditModal(member)}
                      className='px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(member)}
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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 transition-opacity duration-200'>
          <div className='w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-200 scale-100 opacity-100'>
            <div className='flex items-center justify-between px-8 py-5 border-b'>
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Edit Member
                </h3>
                <p className='text-sm text-gray-500 mt-1'>
                  Update member information
                </p>
              </div>

              <button
                onClick={closeEditModal}
                className='w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 flex items-center justify-center transition'
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={onSubmitEdit} className='p-8 space-y-6'>
              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={onChange}
                    className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={onChange}
                    className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                  />
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Phone
                  </label>
                  <input
                    type='text'
                    name='phone'
                    value={formData.phone}
                    onChange={onChange}
                    className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Department
                  </label>
                  <select
                    name='department'
                    value={formData.department}
                    onChange={onChange}
                    className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                  >
                    <option value=''>Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Status
                  </label>
                  <select
                    name='status'
                    value={formData.status}
                    onChange={onChange}
                    className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                  >
                    <option value='active'>Active</option>
                    <option value='inactive'>Inactive</option>
                  </select>
                </div>

                <div></div>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Description
                </label>
                <textarea
                  rows='4'
                  name='description'
                  value={formData.description}
                  onChange={onChange}
                  className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                />
              </div>

              <div className='flex gap-3 pt-2'>
                <button
                  type='button'
                  onClick={closeEditModal}
                  disabled={isSubmitting}
                  className='w-full border border-gray-200 py-3 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
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
            <div className='px-6 py-5 border-b'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Delete Member
              </h3>
              <p className='text-sm text-gray-500 mt-1'>
                This action cannot be undone
              </p>
            </div>

            <div className='px-6 py-5 text-center'>
              <p className='text-gray-700'>Are you sure you want to delete</p>
              <p className='font-semibold text-gray-900 mt-1'>
                {deleteTarget?.name}?
              </p>
            </div>

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

export default Members

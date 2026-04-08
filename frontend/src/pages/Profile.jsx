import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaInfoCircle,
} from 'react-icons/fa'
import BackLink from '../components/BackLink'
import { getProfile, updateProfile } from '../features/profiles/profileSlice'

function Profile() {
  const dispatch = useDispatch()

  const { profile, isLoading } = useSelector((state) => state.profile)
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    password: '',
    password2: '',
  })

  useEffect(() => {
    dispatch(getProfile()).unwrap().catch(toast.error)
  }, [dispatch])

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        description: profile.description || '',
        password: '',
        password2: '',
      }))
    }
  }, [profile])

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    if (formData.password && formData.password !== formData.password2) {
      toast.error('Passwords do not match')
      return
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      description: formData.description.trim(),
    }

    if (formData.password.trim()) {
      payload.password = formData.password.trim()
    }

    dispatch(updateProfile(payload))
      .unwrap()
      .then((updatedUser) => {
        // ambil user lama dari localStorage
        const currentUser = JSON.parse(localStorage.getItem('user'))

        // merge data baru
        const mergedUser = {
          ...currentUser,
          name: updatedUser.name,
          email: updatedUser.email,
        }

        // simpan kembali
        localStorage.setItem('user', JSON.stringify(mergedUser))

        toast.success('Profile updated successfully')

        // refresh supaya header ikut update
        window.location.reload()
      })
      .catch(toast.error)
  }

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-4'>
          <BackLink to='/' />
        </div>

        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>My Profile</h1>
          <p className='text-gray-500 mt-2'>
            Update your personal information and account settings
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-6'>
          <div className='bg-white rounded-2xl shadow-md p-6'>
            <div className='flex flex-col items-center text-center'>
              <div className='w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-4'>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              <h2 className='text-xl font-semibold text-gray-800'>
                {profile?.name || '-'}
              </h2>
              <p className='text-sm text-gray-500 mt-1'>
                {profile?.email || '-'}
              </p>

              <div className='mt-6 w-full space-y-3 text-left'>
                <div className='rounded-xl bg-gray-50 px-4 py-3'>
                  <p className='text-xs text-gray-500'>Role</p>
                  <p className='text-sm font-medium text-gray-800 capitalize'>
                    {profile?.role || user?.role || '-'}
                  </p>
                </div>

                <div className='rounded-xl bg-gray-50 px-4 py-3'>
                  <p className='text-xs text-gray-500'>Department</p>
                  <p className='text-sm font-medium text-gray-800'>
                    {profile?.department?.name || '-'}
                  </p>
                </div>

                <div className='rounded-xl bg-gray-50 px-4 py-3'>
                  <p className='text-xs text-gray-500'>Status</p>
                  <p className='text-sm font-medium text-gray-800 capitalize'>
                    {profile?.status || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='lg:col-span-2 bg-white rounded-2xl shadow-md p-6 md:p-8'>
            <form onSubmit={onSubmit} className='space-y-6'>
              <div className='grid md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Full Name
                  </label>
                  <div className='relative'>
                    <FaUserCircle className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={onChange}
                      className='w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                      placeholder='Enter your full name'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email
                  </label>
                  <div className='relative'>
                    <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={onChange}
                      className='w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                      placeholder='Enter your email'
                    />
                  </div>
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Phone
                  </label>
                  <div className='relative'>
                    <FaPhone className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                    <input
                      type='text'
                      name='phone'
                      value={formData.phone}
                      onChange={onChange}
                      className='w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                      placeholder='Enter your phone number'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    New Password
                  </label>
                  <div className='relative'>
                    <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                    <input
                      type='password'
                      name='password'
                      value={formData.password}
                      onChange={onChange}
                      className='w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                      placeholder='Leave blank if unchanged'
                    />
                  </div>
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                    <input
                      type='password'
                      name='password2'
                      value={formData.password2}
                      onChange={onChange}
                      className='w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'
                      placeholder='Repeat new password'
                    />
                  </div>
                </div>

                <div></div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Description
                </label>
                <div className='relative'>
                  <FaInfoCircle className='absolute left-4 top-4 text-gray-400' />
                  <textarea
                    rows='4'
                    name='description'
                    value={formData.description}
                    onChange={onChange}
                    className='w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none'
                    placeholder='Tell something about yourself'
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60'
              >
                {isLoading ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

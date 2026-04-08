const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('department', 'name')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.status(200).json(user)
})

// @desc    Update current user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, description, password } = req.body

  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (!name || !name.trim() || !email || !email.trim()) {
    res.status(400)
    throw new Error('Name and email are required')
  }

  const normalizedEmail = email.trim().toLowerCase()

  const emailExists = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: req.user._id },
  })

  if (emailExists) {
    res.status(400)
    throw new Error('Email already exists')
  }

  user.name = name.trim()
  user.email = normalizedEmail
  user.phone = phone?.trim() || ''
  user.description = description?.trim() || ''

  if (password && password.trim()) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password.trim(), salt)
  }

  const updatedUser = await user.save()

  const safeUser = await User.findById(updatedUser._id)
    .select('-password')
    .populate('department', 'name')

  res.status(200).json(safeUser)
})

module.exports = {
  getProfile,
  updateProfile,
}

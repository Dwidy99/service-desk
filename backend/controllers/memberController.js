const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// @desc Create member
// @route POST /api/members
// @access Private/Admin
const createMember = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    department,
    description,
    role,
    status,
  } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all required fields')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('Email user already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const member = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    phone: phone?.trim() || '',
    department: department || null,
    description: description?.trim() || '',
    role: role || 'member',
    status: status || 'active',
    createdBy: req.user._id,
    mustChangePassword: true,
  })

  const populatedMember = await User.findById(member._id).populate(
    'department',
    'name'
  )

  console.log(populatedMember)

  res.status(201).json(populatedMember)
})

// @desc Get members created by current admin
// @route GET /api/members
// @access Private/Admin
const getMembers = asyncHandler(async (req, res) => {
  const members = await User.find({
    role: 'member',
    createdBy: req.user._id,
  })
    .populate('department', 'name')
    .sort({ createdAt: -1 })

  res.status(200).json(members)
})

// @desc Update member created by current admin
// @route PUT /api/members/:id
// @access Private/Admin
const updateMember = asyncHandler(async (req, res) => {
  const { name, email, phone, description, status, department } = req.body

  const member = await User.findOne({
    _id: req.params.id,
    role: 'member',
    createdBy: req.user._id,
  })

  if (!member) {
    res.status(404)
    throw new Error('Member not found')
  }

  if (email && email.trim()) {
    const exists = await User.findOne({
      email: email.trim().toLowerCase(),
      _id: { $ne: req.params.id },
    })

    if (exists) {
      res.status(400)
      throw new Error(`${email} already exists`)
    }
  }

  member.name = name?.trim() || member.name
  member.email = email?.trim().toLowerCase() || member.email
  member.phone = phone?.trim() || ''
  member.description = description?.trim() || ''
  member.status = status || member.status
  member.department = department || null

  const updated = await member.save()
  const populatedMember = await User.findById(updated._id).populate(
    'department',
    'name'
  )

  res.status(200).json(populatedMember)
})

// @desc Delete member created by current admin
// @route DELETE /api/members/:id
// @access Private/Admin
const deleteMember = asyncHandler(async (req, res) => {
  const member = await User.findOne({
    _id: req.params.id,
    role: 'member',
    createdBy: req.user._id,
  })

  if (!member) {
    res.status(404)
    throw new Error('Member not found')
  }

  await member.deleteOne()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  createMember,
  getMembers,
  updateMember,
  deleteMember,
}

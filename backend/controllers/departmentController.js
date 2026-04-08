const asyncHandler = require('express-async-handler')
const Department = require('../models/departmentModel')

// @desc Get all departments
// @route GET /api/departments
// @access Private
const getDepartments = asyncHandler(async (req, res) => {
  let query = {}

  // 🔥 ADMIN → lihat miliknya sendiri
  if (req.user.role === 'admin') {
    query.createdBy = req.user._id
  }

  // 🔥 MEMBER → lihat milik adminnya
  if (req.user.role === 'member') {
    if (!req.user.createdBy) {
      res.status(400)
      throw new Error('Member has no admin')
    }

    query.createdBy = req.user.createdBy
  }

  const departments = await Department.find(query).sort({ createdAt: -1 })

  res.status(200).json(departments)
})

// @desc Create department
// @route POST /api/departments
// @access Private/Admin
const createDepartment = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body

  if (!name || !name.trim()) {
    res.status(400)
    throw new Error('Department name is required')
  }

  const normalizedName = name.trim()

  const exists = await Department.findOne({
    name: normalizedName,
    createdBy: req.user._id,
  })

  if (exists) {
    res.status(400)
    throw new Error(`${normalizedName} already exists`)
  }

  if (status && !['active', 'inactive'].includes(status)) {
    res.status(400)
    throw new Error('Invalid status value')
  }

  const department = await Department.create({
    name: normalizedName,
    description: description?.trim() || '',
    status: status || 'active',
    createdBy: req.user._id,
  })

  res.status(201).json(department)
})

// @desc Update department
// @route PUT /api/departments/:id
// @access Private/Admin
const updateDepartment = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body

  const department = await Department.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  })

  if (!department) {
    res.status(404)
    throw new Error('Department not found')
  }

  if (name && name.trim()) {
    const normalizedName = name.trim()

    const exists = await Department.findOne({
      name: normalizedName,
      _id: { $ne: req.params.id },
      createdBy: req.user._id,
    })

    if (exists) {
      res.status(400)
      throw new Error(`${normalizedName} already exists`)
    }

    department.name = normalizedName
  }

  if (description !== undefined) {
    department.description = description?.trim() || ''
  }

  if (status && !['active', 'inactive'].includes(status)) {
    res.status(400)
    throw new Error('Invalid status value')
  }

  if (status) {
    department.status = status
  }

  const updated = await department.save()

  res.status(200).json(updated)
})

// @desc Delete department
// @route DELETE /api/departments/:id
// @access Private/Admin
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  })

  if (!department) {
    res.status(404)
    throw new Error('Department not found')
  }

  await department.deleteOne()

  res.status(200).json({
    message: 'Department deleted successfully',
    id: req.params.id,
  })
})

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
}

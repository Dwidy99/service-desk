const asyncHandler = require('express-async-handler')
const Ticket = require('../models/ticketModel')
const Department = require('../models/departmentModel')
const User = require('../models/userModel')

const getObjectId = (value) => {
  if (!value) return null
  if (typeof value === 'string') return value
  if (value._id) return value._id.toString()
  return value.toString()
}

const canMemberAccessTicket = (ticket, user) => {
  const ticketUserId = getObjectId(ticket.user)
  const ticketDepartmentId = getObjectId(ticket.department)
  const ticketCreatedById = getObjectId(ticket.createdBy)

  const userId = getObjectId(user._id)
  const userDepartmentId = getObjectId(user.department)
  const userCreatedById = getObjectId(user.createdBy)

  const canAccessPersonal =
    ticket.visibility === 'personal' && ticketUserId === userId

  const canAccessDepartment =
    ticket.visibility === 'department' &&
    ticketDepartmentId === userDepartmentId &&
    ticketCreatedById === userCreatedById

  return canAccessPersonal || canAccessDepartment
}

const canAdminAccessTicket = (ticket, user) => {
  const ticketCreatedById = getObjectId(ticket.createdBy)
  const userId = getObjectId(user._id)

  return ticketCreatedById === userId
}

// @desc    Get tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
  let query = {}

  if (req.user.role === 'admin') {
    query = {
      createdBy: req.user._id,
    }
  }

  if (req.user.role === 'member') {
    if (!req.user.department || !req.user.createdBy) {
      res.status(400)
      throw new Error('Member not properly assigned to department/admin')
    }

    query = {
      $or: [
        {
          visibility: 'personal',
          user: req.user._id,
        },
        {
          visibility: 'department',
          department: req.user.department,
          createdBy: req.user.createdBy,
        },
      ],
    }
  }

  const tickets = await Ticket.find(query)
    .populate('user', 'name email role department createdBy')
    .populate('department', 'name')
    .populate('createdBy', 'name email role')
    .populate('assignedAdmins', 'name email role')
    .sort({ createdAt: -1 })

  res.status(200).json(tickets)
})

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('user', 'name email role department createdBy')
    .populate('department', 'name')
    .populate('createdBy', 'name email role')
    .populate('assignedAdmins', 'name email role')

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (req.user.role === 'member' && !canMemberAccessTicket(ticket, req.user)) {
    res.status(403)
    throw new Error('Not authorized')
  }

  if (req.user.role === 'admin' && !canAdminAccessTicket(ticket, req.user)) {
    res.status(403)
    throw new Error('Not authorized')
  }

  res.status(200).json(ticket)
})

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  const { title, department, description } = req.body

  if (!title?.trim() || !department || !description?.trim()) {
    res.status(400)
    throw new Error('Please complete title, department, and description')
  }

  const departmentExists = await Department.findById(department)

  if (!departmentExists) {
    res.status(404)
    throw new Error('Department not found')
  }

  const ticketData = {
    title: title.trim(),
    department,
    description: description.trim(),
    status: 'new',
    assignedAdmins: [],
  }

  if (req.user.role === 'member') {
    if (!req.user.createdBy) {
      res.status(400)
      throw new Error('Member has no admin')
    }

    ticketData.user = req.user._id
    ticketData.createdBy = req.user.createdBy
    ticketData.visibility = 'personal'
  }

  if (req.user.role === 'admin') {
    ticketData.user = null
    ticketData.createdBy = req.user._id
    ticketData.visibility = 'department'
  }

  const ticket = await Ticket.create(ticketData)

  const populatedTicket = await Ticket.findById(ticket._id)
    .populate('user', 'name email role department createdBy')
    .populate('department', 'name')
    .populate('createdBy', 'name email role')
    .populate('assignedAdmins', 'name email role')

  res.status(201).json(populatedTicket)
})

// @desc    Assign / change ticket department
// @route   PUT /api/tickets/:id/assign-department
// @access  Private/Admin
const assignTicketDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.body

  if (req.user.role !== 'admin') {
    res.status(403)
    throw new Error('Only admin can change ticket department')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (!canAdminAccessTicket(ticket, req.user)) {
    res.status(403)
    throw new Error('Not authorized')
  }

  const departmentExists = await Department.findById(departmentId)

  if (!departmentExists) {
    res.status(404)
    throw new Error('Department not found')
  }

  ticket.department = departmentId
  await ticket.save()

  const updatedTicket = await Ticket.findById(ticket._id)
    .populate('user', 'name email role')
    .populate('department', 'name')
    .populate('createdBy', 'name email role')
    .populate('assignedAdmins', 'name email role')

  res.status(200).json(updatedTicket)
})

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
// @access  Private/Admin
const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  if (req.user.role !== 'admin') {
    res.status(403)
    throw new Error('Only admin can update ticket status')
  }

  const allowedStatuses = ['new', 'open', 'onHold', 'closed']

  if (!allowedStatuses.includes(status)) {
    res.status(400)
    throw new Error('Invalid ticket status')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (!canAdminAccessTicket(ticket, req.user)) {
    res.status(403)
    throw new Error('Not authorized')
  }

  ticket.status = status
  await ticket.save()

  const updatedTicket = await Ticket.findById(ticket._id)
    .populate('user', 'name email role')
    .populate('department', 'name')
    .populate('createdBy', 'name email role')
    .populate('assignedAdmins', 'name email role')

  res.status(200).json(updatedTicket)
})

// @desc    Update ticket basic data
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (req.user.role === 'member') {
    res.status(403)
    throw new Error('Member cannot update ticket directly')
  }

  if (req.user.role === 'admin' && !canAdminAccessTicket(ticket, req.user)) {
    res.status(403)
    throw new Error('Not authorized')
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  )
    .populate('user', 'name email role')
    .populate('department', 'name')
    .populate('createdBy', 'name email role')
    .populate('assignedAdmins', 'name email role')

  res.status(200).json(updatedTicket)
})

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (req.user.role === 'member' && !canMemberAccessTicket(ticket, req.user)) {
    res.status(403)
    throw new Error('Not authorized')
  }

  if (req.user.role === 'admin' && !canAdminAccessTicket(ticket, req.user)) {
    res.status(403)
    throw new Error('Not authorized')
  }

  await ticket.deleteOne()

  res.status(200).json({ success: true })
})

// @desc    Assign admins to ticket
// @route   PUT /api/tickets/:id/assign-admins
// @access  Private/Admin
const assignAdmins = asyncHandler(async (req, res) => {
  const { adminIds } = req.body

  if (req.user.role !== 'admin') {
    res.status(403)
    throw new Error('Admin only')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (!canAdminAccessTicket(ticket, req.user)) {
    res.status(403)
    throw new Error('You can only manage your own tickets')
  }

  const admins = await User.find({
    _id: { $in: adminIds || [] },
    role: 'admin',
  })

  ticket.assignedAdmins = admins.map((admin) => admin._id)
  await ticket.save()

  const updatedTicket = await Ticket.findById(ticket._id)
    .populate('user', 'name email role')
    .populate('department', 'name')
    .populate('createdBy', 'name email role')
    .populate('assignedAdmins', 'name email role')

  res.status(200).json(updatedTicket)
})

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  assignTicketDepartment,
  updateTicketStatus,
  updateTicket,
  deleteTicket,
  assignAdmins,
}

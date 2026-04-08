const asyncHandler = require('express-async-handler')
const Note = require('../models/noteModel')
const Ticket = require('../models/ticketModel')

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

// @desc    Get notes for a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId)

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

  const notes = await Note.find({ ticket: req.params.ticketId })
    .populate('user', 'name email role')
    .sort({ createdAt: 1 })

  res.status(200).json(notes)
})

// @desc    Create ticket note / first response
// @route   POST /api/tickets/:ticketId/notes
// @access  Private
const addNote = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (!req.body.text || !req.body.text.trim()) {
    res.status(400)
    throw new Error('Please add some text')
  }

  if (req.user.role === 'member' && !canMemberAccessTicket(ticket, req.user)) {
    res.status(403)
    throw new Error('Not authorized')
  }

  if (req.user.role === 'admin' && !canAdminAccessTicket(ticket, req.user)) {
    res.status(403)
    throw new Error('Not authorized')
  }

  const note = await Note.create({
    text: req.body.text.trim(),
    isStaff: req.user.role === 'admin',
    ticket: req.params.ticketId,
    user: req.user._id,
  })

  const populatedNote = await Note.findById(note._id).populate(
    'user',
    'name email role'
  )

  res.status(201).json(populatedNote)
})

module.exports = {
  getNotes,
  addNote,
}

const express = require('express')
const router = express.Router()
const {
  getTickets,
  getTicket,
  createTicket,
  deleteTicket,
  updateTicket,
  updateTicketStatus,
  assignTicketDepartment,
  assignAdmins,
} = require('../controllers/ticketController')

const { protect } = require('../middleware/authMiddleware')

// Re-route into note router
const noteRouter = require('./noteRoutes')
router.use('/:ticketId/notes', noteRouter)

router.route('/').get(protect, getTickets).post(protect, createTicket)

router.put('/:id/status', protect, updateTicketStatus)
router.put('/:id/assign-department', protect, assignTicketDepartment)
router.put('/:id/assign-admins', protect, assignAdmins)

router
  .route('/:id')
  .get(protect, getTicket)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket)

module.exports = router

// routes/departmentRoutes.js
const express = require('express')
const router = express.Router()
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getDepartments).post(protect, createDepartment)

router
  .route('/:id')
  .put(protect, updateDepartment)
  .delete(protect, deleteDepartment)

module.exports = router

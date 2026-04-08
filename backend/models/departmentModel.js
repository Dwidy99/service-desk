// models/departmentModel.js
const mongoose = require('mongoose')

const departmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add department name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Department', departmentSchema)

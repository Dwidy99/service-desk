const mongoose = require('mongoose')

const memberSchema = mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    email: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    department: {
      type: String,
      required: [true, 'Please select a department'],
      ref: 'Department',
    },
    description: {
      type: String,
      required: [true, 'Please enter a description of the department'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Member', memberSchema)

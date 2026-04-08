const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter a ticket title'],
      trim: true,
    },

    // member owner, null jika ticket dibuat admin untuk department
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // admin owner / admin pembuat ticket
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Please select a department'],
    },

    description: {
      type: String,
      required: [true, 'Please enter a description of the issue'],
      trim: true,
    },

    status: {
      type: String,
      required: true,
      enum: ['new', 'open', 'onHold', 'closed'],
      default: 'new',
    },

    assignedAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    visibility: {
      type: String,
      enum: ['personal', 'department'],
      default: 'personal',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Ticket', ticketSchema)

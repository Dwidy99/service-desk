const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()
require('colors') // ✅ WAJIB

const connectDB = require('../config/db')

const User = require('../models/userModel')
const Department = require('../models/departmentModel')
const Ticket = require('../models/ticketModel')
const Note = require('../models/noteModel')
const Member = require('../models/memberModel')

const importData = async () => {
  try {
    await connectDB()

    await Note.deleteMany()
    await Ticket.deleteMany()
    await Member.deleteMany()
    await Department.deleteMany()
    await User.deleteMany()

    const hashedPassword = await bcrypt.hash('admin123', 10)

    // ================= USERS =================
    const users = await User.insertMany([
      {
        name: 'Admin One',
        email: 'admin1@mail.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        description: 'Main system admin',
      },
      {
        name: 'Admin Two',
        email: 'admin2@mail.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        description: 'Secondary admin',
      },

      // MEMBERS
      ...Array.from({ length: 15 }).map((_, i) => ({
        name: `Member ${i + 1}`,
        email: `member${i + 1}@mail.com`,
        password: hashedPassword,
        role: 'member',
        status: 'active',
      })),
    ])

    // ================= FIX CREATED BY =================
    const adminOne = users[0]
    const adminTwo = users[1]

    // mulai dari index 2 karena 0 & 1 adalah admin
    for (let i = 2; i < users.length; i++) {
      const assignedAdmin = i % 2 === 0 ? adminOne : adminTwo

      await User.findByIdAndUpdate(users[i]._id, {
        createdBy: assignedAdmin._id,
      })
    }

    // ================= DEPARTMENTS =================
    const departments = await Department.insertMany([
      {
        name: 'IT Support',
        description: 'Technical issues and system maintenance',
        createdBy: users[0]._id,
      },
      {
        name: 'HR',
        description: 'Employee and payroll issues',
        createdBy: users[1]._id,
      },
      {
        name: 'Finance',
        description: 'Budget and finance operations',
        createdBy: users[0]._id,
      },
      {
        name: 'Operations',
        description: 'Operational tasks and logistics',
        createdBy: users[1]._id,
      },
      {
        name: 'Customer Service',
        description: 'Customer handling and complaints',
        createdBy: users[0]._id,
      },
    ])

    // assign department ke member
    for (let i = 2; i < users.length; i++) {
      await User.findByIdAndUpdate(users[i]._id, {
        department: departments[i % departments.length]._id,
      })
    }

    // ================= TICKETS =================
    const tickets = await Ticket.insertMany(
      Array.from({ length: 15 }).map((_, i) => ({
        title: `Issue #${i + 1}`,
        user: users[2 + (i % 15)]._id,
        createdBy: users[i % 2]._id,
        department: departments[i % departments.length]._id,
        description: `Detailed issue description for ticket ${i + 1}`,
        status: ['new', 'open', 'onHold', 'closed'][i % 4],
        assignedAdmins: [users[i % 2]._id],
        visibility: i % 3 === 0 ? 'department' : 'personal',
      }))
    )

    // ================= NOTES (🔥 BANYAK & REALISTIS) =================
    const notes = []

    tickets.forEach((ticket, i) => {
      const memberUser = ticket.user
      const adminUser = ticket.assignedAdmins[0]

      notes.push(
        {
          user: memberUser,
          ticket: ticket._id,
          text: 'I have an issue, please help.',
          isStaff: false,
        },
        {
          user: adminUser,
          ticket: ticket._id,
          text: 'We are checking your issue.',
          isStaff: true,
        },
        {
          user: memberUser,
          ticket: ticket._id,
          text: 'Any update on this?',
          isStaff: false,
        },
        {
          user: adminUser,
          ticket: ticket._id,
          text: 'Issue is being processed.',
          isStaff: true,
        }
      )

      // tambah variasi biar realistis
      if (i % 2 === 0) {
        notes.push({
          user: adminUser,
          ticket: ticket._id,
          text: 'Please try basic troubleshooting first.',
          isStaff: true,
        })
      }

      if (i % 3 === 0) {
        notes.push({
          user: memberUser,
          ticket: ticket._id,
          text: 'I have tried but still not working.',
          isStaff: false,
        })
      }
    })

    await Note.insertMany(notes)

    console.log('🔥 SUPER COMPLETE DUMMY DATA INSERTED')

    console.log('Dummy data imported successfully')
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

importData()

import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import ticketReducer from '../features/tickets/ticketSlice'
import noteReducer from '../features/notes/noteSlice'
import departmentReducer from '../features/departments/departmentSlice'
import memberReducer from '../features/members/memberSlice'
import profileReducer from '../features/profiles/profileSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    notes: noteReducer,
    departments: departmentReducer,
    members: memberReducer,
    profile: profileReducer,
  },
})

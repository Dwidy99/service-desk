import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ticketService from './ticketService'
import { extractErrorMessage } from '../../utils'

const initialState = {
  tickets: [],
  ticket: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
}

export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.createTicket(ticketData, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const getTickets = createAsyncThunk(
  'tickets/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.getTickets(token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const getTicket = createAsyncThunk(
  'tickets/getOne',
  async (ticketId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.getTicket(ticketId, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const closeTicket = createAsyncThunk(
  'tickets/close',
  async (ticketId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.closeTicket(ticketId, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const openTicket = createAsyncThunk(
  'tickets/open',
  async (ticketId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.openTicket(ticketId, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateStatus',
  async ({ ticketId, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.updateTicketStatus(ticketId, status, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const assignDepartment = createAsyncThunk(
  'tickets/assignDepartment',
  async ({ ticketId, departmentId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.assignDepartment(ticketId, departmentId, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    reset: (state) => {
      state.ticket = null
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        if (action.payload && typeof action.payload === 'object') {
          state.tickets.unshift(action.payload)
        }
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to create ticket'
      })

      .addCase(getTickets.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tickets = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to load tickets'
        state.tickets = []
      })

      .addCase(getTicket.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ticket =
          action.payload && typeof action.payload === 'object'
            ? action.payload
            : null
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to load ticket'
        state.ticket = null
      })

      .addCase(closeTicket.fulfilled, (state, action) => {
        state.isSuccess = true
        if (action.payload && action.payload._id) {
          state.tickets = state.tickets.map((ticket) =>
            ticket._id === action.payload._id ? action.payload : ticket
          )
          if (state.ticket?._id === action.payload._id) {
            state.ticket = action.payload
          }
        }
      })

      .addCase(openTicket.fulfilled, (state, action) => {
        state.isSuccess = true
        if (action.payload && action.payload._id) {
          state.tickets = state.tickets.map((ticket) =>
            ticket._id === action.payload._id ? action.payload : ticket
          )
          if (state.ticket?._id === action.payload._id) {
            state.ticket = action.payload
          }
        }
      })

      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.isSuccess = true
        if (action.payload && action.payload._id) {
          state.tickets = state.tickets.map((ticket) =>
            ticket._id === action.payload._id ? action.payload : ticket
          )
          if (state.ticket?._id === action.payload._id) {
            state.ticket = action.payload
          }
        }
      })

      .addCase(assignDepartment.fulfilled, (state, action) => {
        state.isSuccess = true
        if (action.payload && action.payload._id) {
          state.tickets = state.tickets.map((ticket) =>
            ticket._id === action.payload._id ? action.payload : ticket
          )
          if (state.ticket?._id === action.payload._id) {
            state.ticket = action.payload
          }
        }
      })
  },
})

export const { reset } = ticketSlice.actions
export default ticketSlice.reducer

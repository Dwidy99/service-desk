import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import memberService from './memberService'
import { extractErrorMessage } from '../../utils'

const initialState = {
  members: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
}

export const createMember = createAsyncThunk(
  'members/create',
  async (memberData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await memberService.createMember(memberData, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const getMembers = createAsyncThunk(
  'members/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await memberService.getMembers(token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const updateMember = createAsyncThunk(
  'members/update',
  async ({ id, memberData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await memberService.updateMember(id, memberData, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const deleteMember = createAsyncThunk(
  'members/delete',
  async (memberId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      await memberService.deleteMember(memberId, token)
      return memberId
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMember.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        if (action.payload && typeof action.payload === 'object') {
          state.members.unshift(action.payload)
        }
      })
      .addCase(createMember.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to create member'
      })

      .addCase(getMembers.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(getMembers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.members = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(getMembers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to load members'
        state.members = []
      })

      .addCase(updateMember.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        if (action.payload && action.payload._id) {
          state.members = state.members.map((member) =>
            member._id === action.payload._id ? action.payload : member
          )
        }
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to update member'
      })

      .addCase(deleteMember.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.members = state.members.filter(
          (member) => member._id !== action.payload
        )
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to delete member'
      })
  },
})

export const { reset } = memberSlice.actions
export default memberSlice.reducer

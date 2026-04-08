// src/features/members/memberSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import memberService from './memberService'
import { extractErrorMessage } from '../../utils'

const initialState = {
  members: [],
  isLoading: false,
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMember.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.isLoading = false
        state.members.unshift(action.payload)
      })
      .addCase(createMember.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getMembers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMembers.fulfilled, (state, action) => {
        state.isLoading = false
        state.members = action.payload
      })
      .addCase(getMembers.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(updateMember.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.isLoading = false
        state.members = state.members.map((member) =>
          member._id === action.payload._id ? action.payload : member
        )
      })
      .addCase(updateMember.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(deleteMember.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.isLoading = false
        state.members = state.members.filter(
          (member) => member._id !== action.payload
        )
      })
      .addCase(deleteMember.rejected, (state) => {
        state.isLoading = false
      })
  },
})

export default memberSlice.reducer
